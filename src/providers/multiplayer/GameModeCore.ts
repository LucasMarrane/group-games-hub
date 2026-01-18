import { _defaultMultiplayerStore, MultiplayerStore } from './multiplayer.store';
import { Player } from './types';

export const MultiplayerProviderEvents = {
    JOIN_ROOM: 'join_room',
    JOIN_CONFIRMED:'join_confirmed',
    ADD_PLAYER: 'add_player',
    REMOVE_PLAYER: 'remove_player',
    PLAYER_JOINED: 'player_joined',
    PLAYER_LEFT: 'player_left',
    ROOM_CLOSED: 'room_closed',
    ROOM_CREATED: 'room_created',
    STATE: 'state',
} as const;

export type EventCallback<T = any> = (data: T) => void;
export type MultiplayerProviderEventsKeys = (typeof MultiplayerProviderEvents)[keyof typeof MultiplayerProviderEvents];

export class GameModeCore {
    listeners: Map<MultiplayerProviderEventsKeys, EventCallback[]> = new Map();
    state = MultiplayerStore;

    private destroy() {
        this.state.setState(() => ({ ..._defaultMultiplayerStore }), true);
    }

    closeRoom() {
        this.destroy();
    }

    addPlayer(player: Player, roomId: string = 'local-room') {
        this.state.setState((prev) => ({ players: [...prev.players, player], roomId }));
    }

    removePlayer(player: Player) {
        if ((player.type == 'host')) return Promise.reject();
        this.state.setState((prev) => ({ players: prev.players.filter((i) => i.id != player.id) }));
        return Promise.resolve();
    }

    createRoom(host: Player, roomId: string) {
        this.state.setState({
            isHost: true,
            mainPlayer: host.id,
            localPlayerId: host.id,
            roomId: roomId,
            players: [host],
            serverConnected: true,
        });
    }

    gameState(state: any) {
        this.state.setState(state);
    }

    emit<T>(event: MultiplayerProviderEventsKeys, data: T): void {
        const callbacks = this.listeners.get(event);
        if (!callbacks) return;

        callbacks.forEach((cb) => cb(data));
    }

    on<T>(event: MultiplayerProviderEventsKeys, callback: EventCallback<T>): void {
        const current = this.listeners.get(event) || [];
        current.push(callback);
        this.listeners.set(event, current);
    }
}
