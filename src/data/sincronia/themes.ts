import base from './default.json';
import brasilidades from './brasilidades.json';
import clt from './clt.json';
import dilemas from './dilemas.json';
import inuteis from './inuteis.json';
import pop from './pop.json';
import sobrevivencia from './sobrevivencia.json';
import variedades from './variedades.json';
import zoeira from './zoeira.json';
import { ThemeExpansion } from '@appTypes/sincronia';
import { UUID_GAMES } from '@/utils/uuid/games';
import { IGames } from '@appTypes/game';

class Sincronia implements IGames<ThemeExpansion> {
    private _themes = [base, brasilidades, clt, dilemas, inuteis, pop, sobrevivencia, variedades, zoeira] as ThemeExpansion[];
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

    get themes() {
        return this._themes;
    }

    get categories() {
        return this._themes.flatMap((i) => i.categories.map((c) => ({ label: c.name, value: `${i.id}-${c.id}` })));
    }

    get expansions() {
        return this._themes.map((i) => ({ label: i.name, value: i.id }));
    }
}

export const SincroniaGame = new Sincronia();
