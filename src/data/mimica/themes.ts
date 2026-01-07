import { IGames, ITheme } from '@appTypes/game';
import base from './default.json';
import { UUID_GAMES } from '@/utils/uuid/games';
import { GameBase } from '@data/game.base';
import { MimicaItem } from '@appTypes/mimica';

type MimicaGameType = ITheme<MimicaItem>;

class Mimica extends GameBase<MimicaGameType> implements IGames<MimicaGameType> {
    constructor() {
        super();
        this._themes = [base] as MimicaGameType[];
    }

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
}

export const MimicaGame = new Mimica();
