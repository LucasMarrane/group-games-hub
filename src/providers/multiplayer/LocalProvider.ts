import { Player, GameProvider } from './types';
import { toast } from 'sonner';

export class LocalProvider<T = any> implements GameProvider<T> {
    mode: 'local' = 'local';
    isHost = false;
    roomId: string | null = null;
    localPlayerId = '';
    players: Player[] = [];
    gameState: T = undefined as any;
    mainPlayer = '';

    constructor(localPlayerId: string) {
        this.localPlayerId = localPlayerId;
    }

    initialize(): void {
        // Inicialização específica do modo local
    }

    destroy(): void {
        // Limpeza específica do modo local
        this.resetGameContext();
    }

    async createRoom(): Promise<string> {
        this.resetGameContext();
        this.isHost = true;
        this.roomId = 'local-room';
        
        // Criar jogador host
        const hostPlayer: Player = {
            id: this.localPlayerId,
            name: 'Host (Você)',
            isOffline: true,
            type: 'host'
        };
        
        this.players = [hostPlayer];
        this.mainPlayer = this.localPlayerId;
        
        toast.success('Sala local criada!');
        return Promise.resolve('local-room');
    }

    joinRoom(): void {
        // No modo local, não há join room real
        toast.info('Modo local não requer conexão');
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
        this.resetGameContext();
        toast.success('Sala local encerrada.');
    }

    changeGame(gameState: any): void {
        this.gameState = { ...this.gameState, ...gameState };
    }

    // Função de reconexão para modo local
    reconnectToRoom(): Promise<boolean> {
        // No modo local, não há reconexão real pois tudo é mantido em memória
        // Se houver uma sala ativa, retorna sucesso
        if (this.roomId) {
            toast.info('Você já está na sala local');
            return Promise.resolve(true);
        }
        
        toast.info('Nenhuma sala local ativa para reconectar');
        return Promise.resolve(false);
    }

    private resetGameContext(): void {
        this.isHost = false;
        this.roomId = null;
        this.players = [];
        this.gameState = undefined as any;
        this.mainPlayer = '';
    }
}