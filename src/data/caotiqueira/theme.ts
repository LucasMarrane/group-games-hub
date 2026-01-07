import { UUID_GAMES } from '@/utils/uuid/games';
import { IGames, ITheme } from '@appTypes/game';

import { GameBase } from '@data/game.base';
import base from '@data/caotiqueira/default.json';
import { CaotiqueiraItem } from '@appTypes/caotiqueira';

type CaotiqueiraGameType = ITheme<CaotiqueiraItem>;

class Caotiqueira extends GameBase<CaotiqueiraGameType> implements IGames<CaotiqueiraGameType> {
    constructor() {
        super();
        this._themes = [base] as unknown as CaotiqueiraGameType[];
    }
    get uuid() {
        return UUID_GAMES.caotiqueira;
    }
    get name() {
        return 'Caotiqueira';
    }
    get hint() {
        return 'Pense em respostas absurdas, ou não.';
    }

    get description() {
        return `Em cada turno, os jogadores escrevem respostas. A resposta mais votada leva o ponto`;
    }
}

export const CaotiqueiraGame = new Caotiqueira();
