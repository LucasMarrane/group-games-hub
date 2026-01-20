import { _defaultMultiplayerStore, MultiplayerStore } from './multiplayer.store';
import { Player } from './types';

export const MultiplayerProviderEvents = {
    JOIN_ROOM: 'join_room',
    JOIN_CONFIRMED: 'join_confirmed',
    ADD_PLAYER: 'add_player',
    REMOVE_PLAYER: 'remove_player',
    PLAYER_JOINED: 'player_joined',
    PLAYER_LEFT: 'player_left',
    ROOM_CLOSED: 'room_closed',
    ROOM_CREATED: 'room_created',
    KICKED: 'kicked',
    STATE: 'state',
    PLAYERS: 'players',
} as const;

export type EventCallback = (...args: any[]) => void;
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

    addPlayer(player: Player) {
        this.state.setState((prev) => ({
            players: [...prev.players, player],
            localPlayerId: prev.localPlayerId || player.id,
        }));
    }

    removePlayer(player: Player): Promise<boolean> {
        if (player.type == 'host') {
            return Promise.reject(new Error('Cannot remove host'));
        }

        this.state.setState((prev) => ({
            players: prev.players.filter((i) => i.id != player.id),
        }));

        return Promise.resolve(true);
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
        this.state.setState({ gameState: state });
    }

    reset() {
        this.state.setState(_defaultMultiplayerStore, true);
    }

    emit(event: MultiplayerProviderEventsKeys, ...data: any[]): void {
        const callbacks = this.listeners.get(event);
        if (!callbacks) return;

        callbacks.forEach((cb) => cb(...data));
    }

    on(event: MultiplayerProviderEventsKeys, callback: EventCallback): void {
        const current = this.listeners.get(event) || [];
        current.push(callback);
        this.listeners.set(event, current);
    }

    off(event: MultiplayerProviderEventsKeys, callback: EventCallback): void {
        const current = this.listeners.get(event);
        if (current) {
            const index = current.indexOf(callback as any);
            if (index > -1) {
                current.splice(index, 1);
            }
        }
    }
}
