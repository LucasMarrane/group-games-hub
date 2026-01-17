import { Player, OnlineGameProvider } from './types';
import Peer, { DataConnection } from 'peerjs';
import { toast } from 'sonner';

export class OnlineProvider<T = any> implements OnlineGameProvider<T> {
    mode: 'online' = 'online';
    isHost = false;
    roomId: string | null = null;
    localPlayerId = '';
    players: Player[] = [];
    gameState: T = undefined as any;
    mainPlayer = '';
    
    peer: Peer | null = null;
    connections: DataConnection[] = [];
    previousRoomId: string | null = null;

    constructor(localPlayerId: string) {
        this.localPlayerId = localPlayerId;
    }

    initialize(): void {
        this.peer = new Peer();
        
        this.peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
        });
        
        this.peer.on('connection', (conn) => {
            this.handleNewConnection(conn);
        });
        
        this.peer.on('error', (err) => {
            toast.error('Erro de conexão P2P: ' + err.message);
        });
    }

    destroy(): void {
        if (this.peer) {
            this.peer.destroy();
            this.peer = null;
        }
        this.connections = [];
        this.resetGameContext();
    }

    async createRoom(): Promise<string> {
        this.resetGameContext();
        
        return new Promise((resolve, reject) => {
            if (!this.peer) {
                reject(new Error('Peer not initialized'));
                return;
            }
            
            const id = this.peer.id;
            const setupHost = (hostId: string) => {
                this.isHost = true;
                this.roomId = hostId;
                this.previousRoomId = hostId;
                
                // Criar jogador host
                const hostPlayer: Player = {
                    id: this.localPlayerId,
                    name: 'Host (Você)',
                    isOffline: false,
                    type: 'host'
                };
                
                this.players = [hostPlayer];
                this.mainPlayer = this.localPlayerId;
                
                toast.success('Sala online criada!');
                resolve(hostId);
            };

            if (id) {
                setupHost(id);
            } else {
                this.peer.on('open', (newId) => setupHost(newId));
                this.peer.on('error', (err) => reject(err));
            }
        });
    }

    joinRoom(targetRoomId: string): void {
        if (!this.peer) {
            toast.error('Erro: Conexão P2P não ativa');
            return;
        }
        
        try {
            const conn = this.peer.connect(targetRoomId);
            this.handleNewConnection(conn);
            
            conn.on('open', () => {
                conn.send(
                    JSON.stringify({
                        type: 'JOIN_REQUEST',
                        playerId: this.localPlayerId,
                        playerName: 'Jogador',
                    }),
                );
            });
            
            this.previousRoomId = targetRoomId;
        } catch (error) {
            toast.error('Erro ao conectar à sala');
        }
    }

    startGame(gameState: string = 'setup', initGameState = {} as any): void {
        if (!this.isHost) {
            toast.error('Apenas o host pode iniciar o jogo');
            return;
        }
        
        const initialGameState = {
            phase: gameState,
            players: this.players.map((p) => p.id),
            ...initGameState,
        };
        
        this.gameState = initialGameState as any;
        this.broadcastMessage({ type: 'START_GAME', gameState: initialGameState });
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
        this.broadcastMessage({
            type: 'PLAYER_JOINED',
            player: { id: newPlayer.id, name: newPlayer.name },
        });
        toast.success(`${name} adicionado!`);
    }

    removePlayer(playerId: string): void {
        if (!this.isHost) return;
        if (playerId === this.localPlayerId) return;

        const playerToRemove = this.players.find((p) => p.id === playerId);
        if (!playerToRemove) return;

        this.players = this.players.filter((p) => p.id !== playerId);
        
        if (playerToRemove.isOffline) {
            toast.info(`${playerToRemove.name} removido.`);
            this.broadcastMessage({ type: 'PLAYER_LEFT', playerId });
        } else {
            // Para jogadores online, enviar mensagem de kick
            const conn = this.connections.find(c => c.metadata?.playerId === playerId);
            if (conn) {
                conn.send(JSON.stringify({ type: 'KICKED' }));
                setTimeout(() => conn.close(), 100);
            }
        }
    }

    closeRoom(): void {
        if (!this.isHost) {
            this.removePlayer(this.localPlayerId);
            return;
        }

        this.broadcastMessage({ type: 'ROOM_CLOSED' });
        
        setTimeout(() => {
            this.connections.forEach((conn) => conn.close());
            this.resetGameContext();
        }, 100);
        
        toast.success('Sala online encerrada.');
    }

    changeGame(gameState: any): void {
        this.gameState = { ...this.gameState, ...gameState };
        this.broadcastMessage({ type: 'CHANGE_GAME', gameState });
    }

    connectToPeer(peerId: string): void {
        if (!this.peer) return;
        
        const conn = this.peer.connect(peerId);
        this.handleNewConnection(conn);
    }

    broadcastMessage(message: any, excludeConn?: DataConnection): void {
        const messageStr = JSON.stringify(message);
        this.connections.forEach((conn) => {
            if (conn !== excludeConn && conn.open) {
                conn.send(messageStr);
            }
        });
    }

    // Função de reconexão para modo online
    async reconnectToRoom(): Promise<boolean> {
        if (!this.previousRoomId) {
            toast.error('Nenhuma sala anterior para reconectar');
            return Promise.resolve(false);
        }

        if (this.peer && this.peer.disconnected) {
            try {
                await this.peer.reconnect();
                toast.success('Reconectado ao serviço P2P');
            } catch (error) {
                toast.error('Falha ao reconectar ao serviço P2P');
                return Promise.resolve(false);
            }
        }

        // Tentar reconectar à sala anterior
        try {
            this.joinRoom(this.previousRoomId);
            toast.success('Tentando reconectar à sala...');
            return Promise.resolve(true);
        } catch (error) {
            toast.error('Falha ao reconectar à sala');
            return Promise.resolve(false);
        }
    }

    private handleNewConnection(conn: DataConnection): void {
        this.connections = [...this.connections, conn];

        conn.on('data', (data) => this.handleIncomingData(data, conn));

        conn.on('close', () => {
            this.connections = this.connections.filter((c) => c !== conn);

            const playerToRemove = this.players.find((p) => p.id === conn.metadata?.playerId);
            if (playerToRemove) {
                this.players = this.players.filter((p) => p.id !== conn.metadata?.playerId);
                toast.info(`${playerToRemove.name} saiu da sala`);

                if (this.isHost) {
                    this.broadcastMessage({
                        type: 'PLAYER_LEFT',
                        playerId: playerToRemove.id,
                    });
                }
            }
        });
    }

    private handleIncomingData(data: any, conn: DataConnection): void {
        try {
            const message = JSON.parse(data);

            switch (message.type) {
                case 'JOIN_REQUEST':
                    const newPlayer: Player = {
                        id: message.playerId,
                        name: message.playerName || `Jogador ${this.players.length + 1}`,
                        isOffline: false,
                    };
                    this.players = [...this.players, newPlayer];
                    toast.success(`${newPlayer.name} entrou na sala`);

                    conn.metadata = { playerId: message.playerId };
                    conn.send(
                        JSON.stringify({
                            type: 'JOIN_CONFIRMED',
                            playerId: newPlayer.id,
                            isHost: false,
                            roomId: this.roomId,
                            players: this.players.map((p) => ({ id: p.id, name: p.name })),
                        }),
                    );

                    this.broadcastMessage(
                        {
                            type: 'PLAYER_JOINED',
                            player: { id: newPlayer.id, name: newPlayer.name },
                        },
                        conn,
                    );
                    break;

                case 'JOIN_CONFIRMED':
                    this.isHost = message.isHost;
                    this.roomId = message.roomId;
                    const updatedPlayers = message.players.map((p: any) => p);
                    this.players = updatedPlayers;
                    toast.success('Conectado à sala!');
                    break;

                case 'PLAYER_JOINED':
                    if (!this.players.some((p) => p.id === message.player.id)) {
                        this.players = [...this.players, message.player];
                        toast.success(`${message.player.name} entrou na sala`);
                    }
                    break;

                case 'PLAYER_LEFT':
                    this.players = this.players.filter((p) => p.id !== message.playerId);
                    break;

                case 'KICKED':
                    toast.error('Você foi removido da sala pelo Host.');
                    this.resetGameContext();
                    break;

                case 'ROOM_CLOSED':
                    toast.warning('O Host encerrou a sala.');
                    this.resetGameContext();
                    break;

                case 'START_GAME':
                    this.gameState = message.gameState;
                    toast.success('Jogo iniciado!');
                    break;

                case 'CHANGE_GAME':
                    this.gameState = { ...this.gameState, ...message.gameState };
                    break;
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    }

    private resetGameContext(): void {
        this.isHost = false;
        this.roomId = null;
        this.players = [];
        this.gameState = undefined as any;
        this.mainPlayer = '';
        this.connections = [];
    }
}