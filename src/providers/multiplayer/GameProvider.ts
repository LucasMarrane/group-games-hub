import { GameModeCore, MultiplayerProviderEventsKeys } from './GameModeCore';
import { GameMode } from './multiplayer.store';
import { toast } from 'sonner';

export type EventMessage<T = any> = { type: MultiplayerProviderEventsKeys; data: T };

export function dataToMessage(data: any, type?: MultiplayerProviderEventsKeys) {
    return JSON.stringify({ data, type });
}

export abstract class GameProvider {
    protected _multiplayerProvider: GameModeCore;
    protected _notify = toast;

    constructor(mode: GameMode = 'single') {
        this._multiplayerProvider = new GameModeCore();
        this._multiplayerProvider.state.setState({ mode });
        this.init();
    }

    private init() {
        this._multiplayerProvider.on('join_room', this.joinRoom.bind(this));
        this._multiplayerProvider.on('join_confirmed', this.joinConfirmed.bind(this));
        this._multiplayerProvider.on('add_player', this.addPlayer.bind(this));
        this._multiplayerProvider.on('remove_player', this.removePlayer.bind(this));
        this._multiplayerProvider.on('player_joined', this.playerJoined.bind(this));
        this._multiplayerProvider.on('player_left', this.playerLeft.bind(this));
        this._multiplayerProvider.on('room_closed', this.closeRoom.bind(this));
        this._multiplayerProvider.on('room_created', this.createRoom.bind(this));
        this._multiplayerProvider.on('kicked', this.kicked.bind(this));
        this._multiplayerProvider.on('state', this.state.bind(this));
    }

    emit(event: MultiplayerProviderEventsKeys, ...data: any) {
        this._multiplayerProvider.emit(event, ...data);
    }

    destroy() {}

    protected abstract joinRoom(...args: any[]): void;
    protected abstract joinConfirmed(...args: any[]): void;
    protected abstract addPlayer(...args: any[]): void;
    protected abstract removePlayer(...args: any[]): void;
    protected abstract playerJoined(...args: any[]): void;
    protected abstract playerLeft(...args: any[]): void;
    protected abstract closeRoom(...args: any[]): void;
    protected abstract createRoom(...args: any[]): void;
    protected abstract kicked(...args:any[]): void;
    protected abstract state(...args: any[]): void;
}
