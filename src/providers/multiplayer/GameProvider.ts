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
        this._multiplayerProvider.on('add_player', this.addPlayer.bind(this));
        this._multiplayerProvider.on('remove_player', this.removePlayer.bind(this));
        this._multiplayerProvider.on('player_joined', this.playerJoined.bind(this));
        this._multiplayerProvider.on('player_left', this.playerLeft.bind(this));
        this._multiplayerProvider.on('room_closed', this.closeRoom.bind(this));
        this._multiplayerProvider.on('room_created', this.createRoom.bind(this));
        this._multiplayerProvider.on('state', this.state.bind(this));
    }

    emit(event: MultiplayerProviderEventsKeys, data: any) {
        this._multiplayerProvider.emit(event, data);
    }

    destroy() {}
    protected abstract joinRoom(event: string): void;
    protected abstract addPlayer(event: string): void;
    protected abstract removePlayer(event: string): void;
    protected abstract playerJoined(event: string): void;
    protected abstract playerLeft(event: string): void;
    protected abstract closeRoom(event: string): void;
    protected abstract createRoom(event: string): void;
    protected abstract state(event: string): void;
}
