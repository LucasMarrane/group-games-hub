import { Player, ServerGameProvider } from './types';
import { toast } from 'sonner';

export class ServerProvider<T = any> implements ServerGameProvider<T> {
    mode: 'server' = 'server';
    isHost = false;
    roomId: string | null = null;
    localPlayerId = '';
    players: Player[] = [];
    gameState: T = undefined as any;
    mainPlayer = '';
    
    serverConnected = false;
    serverSocket: WebSocket | null = null;
    previousServerUrl: string | null = null;
    previousRoomId: string | null = null;
    playerName: string = 'Jogador';

    constructor(localPlayerId: string) {
        this.localPlayerId = localPlayerId;
    }

    initialize(): void {
        // Inicialização específica do modo servidor
    }

    destroy(): void {
        if (this.serverSocket) {
            this.serverSocket.close();
            this.serverSocket = null;
        }
        this.serverConnected = false;
        this.resetGameContext();
    }

    async createRoom(): Promise<string> {
        if (!this.serverConnected || !this.serverSocket) {
            toast.error('Não conectado ao servidor');
            return Promise.reject('Not connected to server');
        }

        return new Promise((resolve, reject) => {
            if (!this.serverSocket) {
                reject(new Error('Server socket not initialized'));
                return;
            }

            const handleMessage = (event: MessageEvent) => {
                try {
                    const message = JSON.parse(event.data);
                    if (message.type === 'ROOM_CREATED') {
                        this.isHost = true;
                        this.roomId = message.roomId;
                        this.mainPlayer = this.localPlayerId;
                        this.previousRoomId = message.roomId;
                        toast.success('Sala criada no servidor!');
                        resolve(message.roomId);
                        this.serverSocket?.removeEventListener('message', handleMessage);
                    }
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            };

            this.serverSocket.addEventListener('message', handleMessage);
            
            // Enviar solicitação para criar sala
            this.serverSocket.send(JSON.stringify({ type: 'CREATE_ROOM' }));

            // Timeout para fallback
            setTimeout(() => {
                this.serverSocket?.removeEventListener('message', handleMessage);
                reject(new Error('Timeout creating room'));
            }, 5000);
        });
    }

    joinRoom(roomId: string): void {
        if (!this.serverConnected || !this.serverSocket) {
            toast.error('Não conectado ao servidor');
            return;
        }

        this.serverSocket.send(JSON.stringify({ 
            type: 'JOIN_ROOM', 
            roomId,
            playerId: this.localPlayerId
        }));
        
        this.previousRoomId = roomId;
    }

    startGame(gameState: string = 'setup', initGameState = {} as any): void {
        if (!this.isHost) {
            toast.error('Apenas o host pode iniciar o jogo');
            return;
        }
        
        if (!this.serverConnected || !this.serverSocket) {
            toast.error('Não conectado ao servidor');
            return;
        }

        const initialGameState = {
            phase: gameState,
            players: this.players.map((p) => p.id),
            ...initGameState,
        };
        
        this.gameState = initialGameState as any;
        this.serverSocket.send(JSON.stringify({ 
            type: 'START_GAME', 
            gameState: initialGameState 
        }));
        toast.success('Jogo iniciado!');
    }

    addOfflinePlayer(name: string): void {
        const newPlayerId = Math.random().toString(36).substring(2, 10);
        const newPlayer: Player = {
            id: newPlayerId,
            name: name,
            isOffline: true,
        };
        
        this.players = [...this.players, newPlayer];
        toast.success(`${name} adicionado!`);
    }

    removePlayer(playerId: string): void {
        if (!this.isHost) return;
        if (playerId === this.localPlayerId) return;

        const playerToRemove = this.players.find((p) => p.id === playerId);
        if (!playerToRemove) return;

        this.players = this.players.filter((p) => p.id !== playerId);
        toast.info(`${playerToRemove.name} removido.`);
    }

    closeRoom(): void {
        if (!this.serverConnected || !this.serverSocket) {
            toast.error('Não conectado ao servidor');
            return;
        }

        this.serverSocket.send(JSON.stringify({ type: 'CLOSE_ROOM' }));
        this.resetGameContext();
        toast.success('Sala encerrada.');
    }

    changeGame(gameState: any): void {
        this.gameState = { ...this.gameState, ...gameState };
        if (this.serverSocket && this.serverConnected) {
            this.serverSocket.send(JSON.stringify({ 
                type: 'CHANGE_GAME', 
                gameState 
            }));
        }
    }

    async connectToServer(serverUrl: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.serverSocket = new WebSocket(serverUrl);
                this.previousServerUrl = serverUrl;
                
                this.serverSocket.onopen = () => {
                    this.serverConnected = true;
                    toast.success('Conectado ao servidor com sucesso!');
                    
                    // Enviar mensagem de identificação
                    this.serverSocket?.send(JSON.stringify({
                        type: 'IDENTIFY',
                        playerId: this.localPlayerId,
                        playerName: this.playerName
                    }));
                    
                    // Configurar listener para mensagens do servidor
                    this.setupServerMessageHandler();
                    resolve();
                };

                this.serverSocket.onerror = (error) => {
                    toast.error('Erro na conexão com o servidor');
                    console.error('WebSocket error:', error);
                    reject(error);
                };

                this.serverSocket.onclose = () => {
                    this.serverConnected = false;
                    this.serverSocket = null;
                    toast.info('Desconectado do servidor');
                };
            } catch (error) {
                toast.error('Falha ao conectar ao servidor');
                console.error('Connection error:', error);
                reject(error);
            }
        });
    }

    disconnectFromServer(): void {
        if (this.serverSocket) {
            this.serverSocket.close();
        }
        this.serverConnected = false;
        this.serverSocket = null;
        this.resetGameContext();
        toast.success('Desconectado do servidor');
    }

    // Função de reconexão para modo servidor
    async reconnectToRoom(): Promise<boolean> {
        // Primeiro verificar se temos os dados necessários para reconectar
        if (!this.previousServerUrl) {
            toast.error('Nenhum servidor anterior para reconectar');
            return Promise.resolve(false);
        }

        // Reconectar ao servidor
        try {
            await this.connectToServer(this.previousServerUrl);
            
            // Se havia uma sala anterior, tentar reconectar a ela
            if (this.previousRoomId) {
                this.joinRoom(this.previousRoomId);
                toast.success('Reconectando à sala...');
            }
            
            return Promise.resolve(true);
        } catch (error) {
            toast.error('Falha ao reconectar ao servidor');
            return Promise.resolve(false);
        }
    }

    private setupServerMessageHandler(): void {
        if (!this.serverSocket) return;

        this.serverSocket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                this.handleServerMessage(message);
            } catch (error) {
                console.error('Error parsing server message:', error);
            }
        };
    }

    private handleServerMessage(message: any): void {
        switch (message.type) {
            case 'PLAYER_JOINED':
                if (!this.players.some((p) => p.id === message.player.id)) {
                    this.players = [...this.players, message.player];
                    toast.success(`${message.player.name} entrou na sala`);
                }
                break;
            case 'PLAYER_LEFT':
                this.players = this.players.filter((p) => p.id !== message.playerId);
                toast.info('Um jogador saiu da sala');
                break;
            case 'GAME_STATE_UPDATE':
                this.gameState = message.gameState;
                break;
            case 'ROOM_CREATED':
                this.isHost = true;
                this.roomId = message.roomId;
                this.mainPlayer = this.localPlayerId;
                toast.success('Sala criada no servidor!');
                break;
            case 'JOINED_ROOM':
                this.isHost = message.isHost;
                this.roomId = message.roomId;
                const updatedPlayers = message.players.map((p: any) => ({ ...p, isOffline: false }));
                this.players = updatedPlayers;
                toast.success('Conectado à sala do servidor!');
                break;
        }
    }

    private resetGameContext(): void {
        this.isHost = false;
        this.roomId = null;
        this.players = [];
        this.gameState = undefined as any;
        this.mainPlayer = '';
    }
}