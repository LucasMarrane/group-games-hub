import { appStorage } from './storage';

export const B64StorageFactory = (storage: any = localStorage) => {
    return {
        getItem: (key) => {
            const retorno = atob(storage.getItem(key));
            return retorno;
        },
        setItem: (key, value) => {
            storage.setItem(key, btoa(value));
        },
        removeItem: storage.removeItem,
        clear: storage.clear,
    } as Storage;
};

export const IndexedDBStorageFactory = () => {
    return {
        getItem: async (key: string) => {
            const retorno = await appStorage.storage.get(key);
            return retorno?.value;
        },
        setItem: async (key: string, value: any) => {
            await appStorage.storage.put({
                key,
                value,
            });
        },
        removeItem: async (key: string) => {
            await appStorage.storage.delete(key);
        },

        clear: async () => {
            await appStorage.storage.clear();
        },
    } as unknown as Storage;
};
