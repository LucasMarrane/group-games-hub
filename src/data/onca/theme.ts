import { UUID_GAMES } from '@/utils/uuid/games';
import { IGames, ITheme } from '@appTypes/game';
import { OncaItem } from '@appTypes/onca';
import { GameBase } from '@data/game.base';
import base from '@data/onca/default.json';

type OncaGameType = ITheme<OncaItem>;

class Onca extends GameBase<OncaGameType> implements IGames<OncaGameType> {
    constructor() {
        super();
        this._themes = [base] as unknown as OncaGameType[];
    }
    get uuid() {
        return UUID_GAMES.amigos_da_onca;
    }
    get name() {
        return 'Amigos da Onça';
    }
    get hint() {
        return 'Escolher o participante que claramente é a cara do tema.';
    }

    get description() {
        return `Em cada turno, uma tema é sorteado. Esse tema possui uma pergunta e vocês devem votar para decidir a resposta.`;
    }

    get rule() {
        return {
            goal: 'Descobrir quem mais combina com a descrição.',
            howToPlay: `1. Uma carta com uma pergunta é lida (ex: "Quem tem mais cara de dormir de barriga?")
2. Todos votam secretamente em quem acham que combina mais
3. Os votos são revelados simultaneamente
4. Quem tiver mais votos recebe um ponto negativo (1 "onça")
5. O jogo continua com novas cartas
6. Quem tiver MENOS pontos no final vence`,
        };
    }
}

export const OncaGame = new Onca();
