import { createStore, StateCreator } from 'zustand';
import { createJSONStorage, persist, PersistStorage } from 'zustand/middleware';

const persistStorage = persist as unknown as Function;

type StoreFactoryConfig = {
    name: string;
    storage?: PersistStorage<Storage>;
};

export function isStateFunction(currentValue: any, oldValue: any) {
    return typeof currentValue == 'function' ? currentValue(oldValue) : currentValue;
}

export function storeFactory<T extends {}>(callback: StateCreator<T>, config?: StoreFactoryConfig) {
    let callbackCreator = callback;
    if (config?.name) {
        callbackCreator = persistStorage(callback, {
            name: config?.name,
            storage: createJSONStorage(() => {
                let storage = config?.storage ?? (localStorage as unknown as PersistStorage<Storage>);

                return storage as any;
            }),
        });
    }
    return createStore<T>(callbackCreator);
}
