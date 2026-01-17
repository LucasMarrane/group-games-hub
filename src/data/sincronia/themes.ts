import base from './default.json';
import brasilidades from './brasilidades.json';
import clt from './clt.json';
import dilemas from './dilemas.json';
import inuteis from './inuteis.json';
import pop from './pop.json';
import sobrevivencia from './sobrevivencia.json';
import variedades from './variedades.json';
import zoeira from './zoeira.json';
import { UUID_GAMES } from '@/utils/uuid/games';
import { IGames, ITheme } from '@appTypes/game';
import { SincroniaItem } from '@appTypes/sincronia';
import { GameBase } from '@data/game.base';

export type SincroniaGameType = ITheme<SincroniaItem>;

class Sincronia extends GameBase<SincroniaGameType> implements IGames<SincroniaGameType> {
    constructor() {
        super();
        this._themes = [base, brasilidades, clt, dilemas, inuteis, pop, sobrevivencia, variedades, zoeira] as SincroniaGameType[];
    }

    get uuid() {
        return UUID_GAMES.sincronia;
    }
    get name() {
        return 'Sincronia';
    }
    get hint() {
        return 'Em equipe, ordene os números baseados no tema!';
    }

    get description() {
        return `Cada jogador recebe um conjunto de cartas numéricas e o objetivo é cooperar para colocá-las em ordem crescente. Os jogadores podem discutir e dar dicas a outros, sugerindo algo com base no tema sorteado. Por exemplo, quanto melhor a culinária japonesa, assim, quanto maior o número, mais popular é o prato!`;
    }

    get rule() {
        return {
            goal: 'Colocar cartas numeradas em ordem crescente com base em um tema.',
            howToPlay: `1. Cada jogador recebe cartas numeradas de 1 a 100
2. Um tema é sorteado (ex: "Popularidade de pratos japoneses")
3. Discutam o tema e onde cada número se encaixaria
4. Tentem colocar as cartas em ordem crescente na mesa
5. Revezem-se para jogar uma carta por rodada
6. Se errarem a ordem, perdem pontos
7. O jogo termina quando todas as cartas forem jogadas`,
        };
    }
}

export const SincroniaGame = new Sincronia();
