import Peer, { DataConnection } from 'peerjs';
import { dataToMessage, EventMessage, GameProvider } from './GameProvider';

export class OnlineProvider extends GameProvider {
    private peer: Peer | null;
    connections: DataConnection[] = [];

    constructor() {
        super('online');
        this.peer = new Peer();

        this.peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
        });

        this.peer.on('connection', (conn) => {
            this.handleNewConnection(conn);
        });

        this.peer.on('error', (err) => {
            this._notify.error('Erro de conexão P2P: ' + err.message);
        });
    }
    destroy() {
        this.peer?.destroy();
    }

    protected createRoom(e: string) {
        const {
            data: { host },
        } = JSON.parse(e) as EventMessage;

        new Promise<void>((resolve, reject) => {
            if (!this.peer) {
                reject(new Error('Peer not initialized'));
                return;
            }

            const id = this.peer.id;
            const setupHost = (hostId: string) => {
                this._multiplayerProvider.createRoom(host, hostId);
                this._notify.success('Sala local criada');
                resolve();
            };

            if (id) {
                setupHost(id);
            } else {
                this.peer.on('open', (newId) => setupHost(newId));
                this.peer.on('error', (err) => reject(err));
            }
        });
    }

    protected joinRoom(e: string) {
        const {
            data: { player, roomId },
        } = JSON.parse(e) as EventMessage;

        const conn = this.peer!.connect(roomId);
        this.handleNewConnection(conn);

        conn.on('open', () => {
            conn.send(JSON.stringify({ type: 'add_player', data: { player, roomId } }));
        });
    }

    protected addPlayer(e: string) {
        const {
            data: { player },
        } = JSON.parse(e) as EventMessage;

        this._multiplayerProvider.addPlayer(player);
        // this.emit('player_joined', player);
    }

    protected removePlayer(e: string) {
        const {
            data: { player },
        } = JSON.parse(e) as EventMessage;

        this._multiplayerProvider.removePlayer(player);
        
        this.broadcastMessage({ type: 'player_left', data: { player } });
        // this.emit('player_left', player);
    }

    protected playerJoined(e: string) {
        const {
            data: { players, roomId, name },
        } = JSON.parse(e) as EventMessage;

        this._multiplayerProvider.state.setState({ roomId: roomId, isHost: false, players });

        this._notify(`${name} entrou na sala`);
    }

    protected playerLeft(e: string) {
        const {
            data: { player },
        } = JSON.parse(e) as EventMessage;

        this._notify(`${player.name} deixou sala`);
    }
    protected closeRoom(e: string) {
        const {
            data: { roomId },
        } = JSON.parse(e) as EventMessage;
        if (this.peer) {
            this.peer.destroy();
            this.peer = null;
        }
        this.connections = [];
        this._multiplayerProvider.closeRoom();
        this._notify(`Sala (${roomId}) fechada`);
    }

    protected state(state: any): void {
        this._multiplayerProvider.gameState(state);
    }

    private handleNewConnection(conn: DataConnection): void {
        this.connections = [...this.connections, conn];

        let { players = [], isHost } = this._multiplayerProvider.state.getState();

        conn.on('data', (data) => this.handleIncomingData(data, conn));

        conn.on('close', () => {
            this.connections = this.connections.filter((c) => c !== conn);

            const playerToRemove = players.find((p) => p.id === conn.metadata?.playerId);
            if (playerToRemove) {
                players = players.filter((p) => p.id !== conn.metadata?.playerId);
                this._notify.info(`${playerToRemove.name} saiu da sala`);

                if (isHost) {
                    this.broadcastMessage({
                        type: 'player_left',
                        data: playerToRemove,
                    });
                }
            }
        });
    }

    private handleIncomingData(incoming: any, conn: DataConnection): void {
        try {
            const message: EventMessage<any> = JSON.parse(incoming);
            const { data = {}, type } = message;

            switch (type) {
                case 'add_player':
                    this.addPlayer(incoming);
                    const players = [...this._multiplayerProvider.state.getState().players];

                    conn.send(dataToMessage({ players, roomID: this._multiplayerProvider.state.getState().roomId, name: data.player.name }, 'join_confirmed'));

                    this.broadcastMessage(
                        {
                            type: 'player_joined',
                            data: { players, roomId: this._multiplayerProvider.state.getState().roomId, name: data.player.name },
                        },
                        conn,
                    );
                    break;
                case 'player_joined':
                    this.playerJoined(incoming);
                    break;

                case 'join_confirmed':
                    this._multiplayerProvider.state.setState({ players: data.players, isHost: false, roomId: data.roomId });
                    break;
                case 'player_left':
                    this._multiplayerProvider.state.setState((prev) => ({ players: prev.players.filter((i) => i.id !== data.player.id) }));

                    break;
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    }

    private broadcastMessage(message: EventMessage<any>, excludeConn?: DataConnection): void {
        const messageStr = JSON.stringify(message);
        this.connections.forEach((conn) => {
            if (conn !== excludeConn && conn.open) {
                conn.send(messageStr);
            }
        });
    }
}
