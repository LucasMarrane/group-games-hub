import { createContext, useContext, useEffect, useRef } from 'react';
import { useSessionStore } from './useSessionStore';

import { dataToMessage, type GameProvider } from '@/providers/multiplayer/GameProvider';
import { GameMode, MultiplayerStore, useMultiplayerStore } from '@/providers/multiplayer/multiplayer.store';
import { MultiplayerProviderFactory } from '@/providers/multiplayer/factory';

interface Player {
    id: string;
    name: string;
    avatar: number;
    isOffline?: boolean;
    type?: 'host' | 'invited';
}

interface MultiplayerContextType<T> {
    localPlayerId: string | null;
    players: Player[];
    roomId: string | null;
    isHost: boolean;
    gameState: T;
    mode: GameMode;
    provider: GameProvider;

    setMode(mode: GameMode): void;
    createRoom(): void;
    joinRoom(roomId: string, player?: any): void;
    removePlayer(state?: any): void;
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
                provider: providerRef?.current!,
                localPlayerId,
                players,
                roomId,
                isHost,
                gameState,
                mode,
                setMode(mode) {
                    MultiplayerStore.setState({ mode });
                },

                createRoom() {
                    providerRef.current?.emit(
                        'room_created',
                        dataToMessage({
                            host: {
                                id: player?.uuid,
                                name: player?.nickname,
                                avatar: player?.avatar,
                                type: 'host',
                            },
                        }),
                    );
                },

                joinRoom(roomId, player) {
                    providerRef.current?.emit(
                        'join_room',
                        dataToMessage({
                            roomId,
                            player: {
                                ...player,
                                id: player?.uuid,
                                name: player?.nickname,
                                avatar: player?.avatar,
                                type: 'invited',
                            },
                        }),
                    );
                },
                removePlayer(player) {
                    providerRef.current?.emit('remove_player', dataToMessage({ player }));
                },

                startGame(state) {
                    providerRef.current?.emit('state', dataToMessage({ state }));
                },

                changeGame(state) {
                    providerRef.current?.emit('state', dataToMessage({ state }));
                },

                closeRoom() {
                    providerRef.current?.emit('room_closed', dataToMessage({ roomId }));
                },
            }}
        >
            {children}
        </MultiplayerContext.Provider>
    );
}

export function useMultiplayer<T>() {
    const ctx = useContext(MultiplayerContext);
    if (!ctx) {
        throw new Error('useMultiplayer must be used inside MultiplayerProvider');
    }
    return ctx as MultiplayerContextType<T>;
}
