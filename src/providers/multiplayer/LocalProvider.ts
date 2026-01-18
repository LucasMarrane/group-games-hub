import { dataToMessage, EventMessage, GameProvider } from './GameProvider';
import { GameMode } from './multiplayer.store';

export class LocalProvider extends GameProvider {
    constructor(mode: GameMode = 'single') {
        super(mode);
    }

    protected createRoom(e: string) {
        const {
            data: { host },
        } = JSON.parse(e) as EventMessage;

        this._multiplayerProvider.createRoom(host, 'local-room');
        this._notify.success('Sala local criada');
    }

    protected joinRoom(e: string) {
        const {
            data: { player, roomId },
        } = JSON.parse(e) as EventMessage;
        this._multiplayerProvider.addPlayer(player, roomId);
        this.emit('player_joined', dataToMessage(player));
    }

    protected addPlayer(e: string) {
        const {
            data: { player },
        } = JSON.parse(e) as EventMessage;

        this._multiplayerProvider.addPlayer(player);
        this.emit('player_joined',dataToMessage(player));
    }

    protected removePlayer(e: string) {
        const {
            data: { player },
        } = JSON.parse(e) as EventMessage;

        this._multiplayerProvider.addPlayer(player);
        this.emit('player_left', dataToMessage(player));
    }

    protected playerJoined(e: string) {
        const {
            data: { name },
        } = JSON.parse(e) as EventMessage;

        this._notify(`${name} entrou na sala`);
    }

    protected playerLeft(e: string) {
        const {
            data: { name },
        } = JSON.parse(e) as EventMessage;

        this._notify(`${name} deixou sala`);
    }
    protected closeRoom(e: string) {
        const {
            data: { idRoom = 'local-room' },
        } = JSON.parse(e) as EventMessage;

        this._multiplayerProvider.closeRoom();
        this._notify(`Sala (${idRoom}) fechada`);
    }

    protected state(e: string) {
        const {
            data: { state },
        } = JSON.parse(e) as EventMessage;
        
        this._multiplayerProvider.gameState(state);
    }
}
