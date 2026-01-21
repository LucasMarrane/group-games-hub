import base from './default.json';
export class Nelson {
    static get winner() {
        const index = Math.floor(Math.random() * base.winner.length);
        return base.winner[index];
    }

    static get loser() {
        const index = Math.floor(Math.random() * base.loser.length);
        return base.loser[index];
    }
}
