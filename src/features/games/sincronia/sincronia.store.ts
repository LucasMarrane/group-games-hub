import { IndexedDBStorageFactory } from '@/utils/storage';
import { storeFactory } from '@/utils/store';
import { useStore } from 'zustand';

export interface ISincroniaStore {
    usedThemes?: string[];
    favoriteThemes?: string[];
    hideUsed: boolean;
    showOnlyFavorites: boolean;
}

const _resetSet = {
    usedThemes: [],
    favoriteThemes: [],
};

export const SincroniaStore = storeFactory<ISincroniaStore>(() => ({  hideUsed: false, showOnlyFavorites: false, ..._resetSet }), {
    name: 'sincronia',
    storage: IndexedDBStorageFactory() as any,
});

export function toggleUsed(id: string) {
    SincroniaStore.setState((prev: any) => {
        const newUsed = new Set(prev.usedThemes);
        if (newUsed.has(id)) {
            newUsed.delete(id);
        } else {
            newUsed.add(id);
        }
        return { ...prev, usedThemes: Array.from(newUsed) };
    });
}

export function toggleFavorite(id: string) {
    SincroniaStore.setState((prev: any) => {
        const newFavorite = new Set(prev.favoriteThemes);
        if (newFavorite.has(id)) {
            newFavorite.delete(id);
        } else {
            newFavorite.add(id);
        }
        return { ...prev, favoriteThemes: Array.from(newFavorite) };
    });
}

export function reset() {
    SincroniaStore.setState(_resetSet);
}

export const useSincronia = () => useStore(SincroniaStore);
