import { IGames } from '@appTypes/game';
import base from './default.json';
import { UUID_GAMES } from '@/utils/uuid/games';

class Mimica implements IGames<any> {
    private _themes = [base];
    get uuid() {
        return UUID_GAMES.mimica;
    }
    get name() {
        return 'Mímica';
    }
    get hint() {
        return 'Represente e adivinhe para pontuar';
    }

    get description() {
        return `Pular, balançar os braços, sinalizar. Vale tudo para fazer com que descubram sua mímica, menos falar! `;
    }

    get themes() {
        return this._themes;
    }
}

export const MimicaGame = new Mimica();
