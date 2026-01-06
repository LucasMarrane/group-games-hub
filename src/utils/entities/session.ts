import { Tables } from '@appTypes/database.types';
import { storeFactory } from '../store';
import { IndexedDBStorageFactory } from '../storage';

interface ISessionStore {
    player: Tables<'players'> | null;
}

export const SessionStore = storeFactory<ISessionStore>(
    () => ({
        player: null,       
    }),
    {
        name: 'session',
        storage: IndexedDBStorageFactory() as any,
    },
);


export class Session {
    static get player() {
        return SessionStore.getState().player;
    }
    static logout() {
        return SessionStore.setState((s) => {
            s.player = null;          
            return s;
        });
    }
}