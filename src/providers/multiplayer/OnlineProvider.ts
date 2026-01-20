import Peer, { DataConnection } from 'peerjs';
import { dataToMessage, EventMessage, GameProvider } from './GameProvider';
import { Player } from './types';

export class OnlineProvider extends GameProvider {
    private peer: Peer | null = null;
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
        if (this.peer) {
            this.peer.destroy();
        }
    }

    protected createRoom(host: Player) {
        if (!this.peer) {
            this._notify.error('Serviço P2P não disponível');
            return;
        }

        const roomId = this.peer.id;
        if (!roomId) {
            this._notify.error('ID do host não disponível');
            return;
        }

        this._multiplayerProvider.createRoom(host, roomId);
        this._notify.success('Sala online criada');
    }

    protected joinRoom(player: Player, roomId: string) {
        if (!this.peer) {
            this._notify.error('Serviço P2P não disponível');
            return;
        }

        try {
            const conn = this.peer!.connect(roomId);
            this.handleNewConnection(conn);

            conn.on('open', () => {
                conn.send(dataToMessage({ player, roomId }, 'add_player'));
            });
        } catch (error) {
            console.error('Error joining room:', error);
            this._notify.error('Erro ao entrar na sala');
        }
    }

    protected addPlayer(player: Player) {
        this._multiplayerProvider.addPlayer(player);

        const currentState = this._multiplayerProvider.state.getState();

        const conn = this.connections.find((i) => i.peer == player.connection);

        if (conn) {
            conn.send(
                dataToMessage(
                    {
                        players: currentState.players,
                        roomId: currentState.roomId,
                        playerId: player.id,
                    },
                    'join_confirmed',
                ),
            );
        }

        // Notificar outros participantes
        this.broadcastMessage({
            type: 'player_joined',
            data: {
                player,
                players: this._multiplayerProvider.state.getState().players,
            },
        });
    }

    protected joinConfirmed(join: any) {
        const { players, roomId, playerId } = join;

        this._multiplayerProvider.state.setState({
            roomId,
            isHost: false,
            players,
            localPlayerId: playerId,
        });
    }

    protected removePlayer(player: Player) {
        this._multiplayerProvider.removePlayer(player);

        const conn = this.connections.find((i) => i.peer == player.connection);

        if (conn) {
            conn.send(JSON.stringify({ type: 'kicked' }));
            // Notificar outros participantes
            this.broadcastMessage(
                {
                    type: 'player_left',
                    data: {
                        player,
                        players: this._multiplayerProvider.state.getState().players,
                    },
                },
                player.connection,
            );

            setTimeout(() => {
                conn?.close();
            }, 100);
        }
    }

    protected playerJoined(player: Player) {
        this._notify(`${player.name} entrou na sala`);
    }

    protected playerLeft(player: Player) {
        this._notify(`${player.name} deixou a sala`);
    }

    protected closeRoom(roomId: string) {
        this.destroy();
        this._multiplayerProvider.closeRoom();
        this._notify(`Sala (${roomId}) fechada`);
    }

    protected kicked() {
        this._notify.error('Você foi removido da sala pelo Host.');
        this._multiplayerProvider.reset();
    }

    protected players(players: Player[]) {
        this._multiplayerProvider.state.setState({ players });
        this.broadcastMessage({ type: 'players', data: players });
    }

    protected state(state: any) {
        this._multiplayerProvider.gameState(state);
        this.broadcastMessage({ type: 'state', data: state });
    }

    private handleNewConnection(conn: DataConnection): void {
        this.connections = [...this.connections, conn];
        let { players = [], isHost } = this._multiplayerProvider.state.getState();

        conn.on('data', (data) => this.handleIncomingData(data, conn));

        conn.on('close', () => {
            this.connections = this.connections.filter((c) => c !== conn);

            const playerToRemove = players.find((p) => p.connection === conn.peer);
            if (playerToRemove) {
                players = players.filter((p) => p.id !== conn.peer);
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
                    data.player.connection = conn.peer;
                    this.addPlayer(data.player);
                    break;

                case 'join_confirmed':
                    this.joinConfirmed(data);
                    break;

                case 'player_joined':
                    this.playerJoined(data.player);
                    break;

                case 'room_closed':
                    this._notify.warning('O Host encerrou a sala.');
                    this._multiplayerProvider.reset();
                    break;

                case 'player_left':
                    this.playerLeft(data.player);
                    break;
                case 'players':
                    this._multiplayerProvider.state.setState({players: data});
                    break;
                case 'kicked':
                    this.kicked();
                    break;

                case 'state':
                    this._multiplayerProvider.gameState(data);
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
