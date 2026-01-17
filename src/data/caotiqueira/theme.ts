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

    get rule() {
        return {
            goal: 'Criar respostas engraçadas e ganhar votos.',
            howToPlay: `1. Um tema com lacunas é sorteado (ex: "Prefiro _____ do que ir ao dentista")
2. Cada jogador escreve uma resposta criativa
3. Todas as respostas são lidas em voz alta
4. Votem na resposta mais engraçada ou criativa
5. Quem tiver mais votos ganha um ponto
6. O jogo continua com novos temas
7. Quem tiver mais pontos no final vence`,
        };
    }
}

export const CaotiqueiraGame = new Caotiqueira();
