import Dexie, { Table } from 'dexie';

class AppStorage extends Dexie {
    storage!: Table<any, string>;

    constructor() {
        super('AppStorage');
        this.version(1).stores({
            storage: 'key', 
        });
    }
}


export const appStorage = new AppStorage();