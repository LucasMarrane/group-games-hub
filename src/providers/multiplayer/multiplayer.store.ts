import { storeFactory } from '@/utils/store';
import { Player } from './types';
import { useStore } from 'zustand';

export type GameMode = 'single' | 'local' | 'online' | 'server';

export interface IMultiplayerStore<T = any> {
    mode: GameMode;
    isHost: boolean;
    roomId: string | null;
    localPlayerId: string | null;
    players: Player[];
    gameState: T;
    mainPlayer: string | null;
    serverConnected: boolean;
}

export const _defaultMultiplayerStore: IMultiplayerStore<any> = {
    mode: 'local',
    isHost: false,
    gameState: null,
    localPlayerId: null,
    mainPlayer: null,
    players: [],
    roomId: null,
    serverConnected: false,
};

export const MultiplayerStore = storeFactory<IMultiplayerStore<any>>(() => ({ ..._defaultMultiplayerStore }));
export const useMultiplayerStore = () => useStore(MultiplayerStore);
