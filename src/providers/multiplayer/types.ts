export interface Player {
    id: string;
    name: string;
    isOffline?: boolean;
    type?: 'host' | 'invited';
    avatar: number;
    metadata?: any;
}

export interface GameProvider<T = any> {
    mode: 'local' | 'online' | 'server';
    isHost: boolean;
    roomId: string | null;
    localPlayerId: string;
    players: Player[];
    gameState: T;
    mainPlayer: string;

    
    createRoom(): Promise<string>;
    joinRoom(roomId: string): void;
    startGame(gameState?: string, init?: T): void;
    addOfflinePlayer(name: string): void;
    removePlayer(playerId: string): void;
    closeRoom(): void;
    changeGame(gameState: any): void;

  
    reconnectToRoom(): Promise<boolean>;

    initialize(): void;
    destroy(): void;
}

export interface OnlineGameProvider<T = any> extends GameProvider<T> {
    peer: any;
    connections: any[];
    connectToPeer(peerId: string): void;
    broadcastMessage(message: any, excludeConn?: any): void;
}

export interface ServerGameProvider<T = any> extends GameProvider<T> {
    serverConnected: boolean;
    serverSocket: WebSocket | null;
    connectToServer(serverUrl: string): Promise<void>;
    disconnectFromServer(): void;
}

export interface LocalGameProvider<T = any> extends GameProvider<T> {

}
