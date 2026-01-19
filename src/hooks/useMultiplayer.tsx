import { createContext, useContext, useEffect, useRef } from 'react';
import { useSessionStore } from './useSessionStore';

import { type GameProvider } from '@/providers/multiplayer/GameProvider';
import { GameMode, MultiplayerStore, useMultiplayerStore } from '@/providers/multiplayer/multiplayer.store';
import { MultiplayerProviderFactory } from '@/providers/multiplayer/factory';
import { Player } from '@/providers/multiplayer/types';

interface MultiplayerContextType<T = any> {
    localPlayerId: string | null;
    players: Player[];
    roomId: string | null;
    isHost: boolean;
    gameState: T;
    mode: GameMode;

    setMode(mode: GameMode): void;
    createRoom(): Promise<void>;
    joinRoom(roomId: string, player?: Partial<Player>): Promise<void>;
    removePlayer(player: Player): Promise<void>;
    startGame(state?: any): void;
    changeGame(state: any): void;
    closeRoom(): void;
}

const MultiplayerContext = createContext<MultiplayerContextType<any> | null>(null);

export function MultiplayerProvider({ children, initialMode = 'local' }: any) {
    const { player } = useSessionStore();
    const { players, roomId, mode, isHost, localPlayerId, gameState } = useMultiplayerStore();
    const providerRef = useRef<GameProvider | null>(null);

    useEffect(() => {
        MultiplayerStore.setState({ mode: initialMode });
    }, []);

    useEffect(() => {
        providerRef.current?.destroy();

        providerRef.current = MultiplayerProviderFactory.createProvider(mode);

        const provider = providerRef.current;

        return () => {
            provider.destroy();
        };
    }, [mode]);

    return (
        <MultiplayerContext.Provider
            value={{
                localPlayerId,
                players,
                roomId,
                isHost,
                gameState,
                mode,
                setMode(mode) {
                    MultiplayerStore.setState({ mode });
                },

                async createRoom() {
                    if (!player?.uuid) {
                        throw new Error('Player not authenticated');
                    }

                    providerRef.current?.emit('room_created', {
                        id: player?.uuid,
                        name: player?.nickname || 'Jogador',
                        avatar: player?.avatar || 1,
                        type: 'host',
                    });
                },

                async joinRoom(roomId, playerData) {
                    if (!player?.uuid && !playerData) {
                        throw new Error('Player not authenticated');
                    }

                    providerRef.current?.emit(
                        'join_room',
                        {
                            id: player?.uuid || playerData?.id || `player_${Date.now()}`,
                            name: player?.nickname || playerData?.name || 'Jogador',
                            avatar: player?.avatar || playerData?.avatar || 1,
                            type: 'invited',
                            ...playerData,
                        },
                        roomId,
                    );
                },

                async removePlayer(player) {
                    providerRef.current?.emit('remove_player', player);
                },

                startGame(state) {
                    providerRef.current?.emit('state', state);
                },

                changeGame(state) {
                    providerRef.current?.emit('state', state);
                },

                closeRoom() {
                    providerRef.current?.emit('room_closed', roomId);
                },
            }}
        >
            {children}
        </MultiplayerContext.Provider>
    );
}

export function useMultiplayer<T = any>() {
    const ctx = useContext(MultiplayerContext);
    if (!ctx) {
        throw new Error('useMultiplayer must be used inside MultiplayerProvider');
    }
    return ctx as MultiplayerContextType<T>;
}
