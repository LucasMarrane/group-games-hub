import { IGames, ITheme } from '@appTypes/game';
import base from './default.json';
import { UUID_GAMES } from '@/utils/uuid/games';
import { GameBase } from '@data/game.base';
import { MimicaItem } from '@appTypes/mimica';
import { GameMode } from '@/providers/multiplayer/multiplayer.store';

type MimicaGameType = ITheme<MimicaItem>;

class Mimica extends GameBase<MimicaGameType> implements IGames<MimicaGameType> {
    constructor() {
        super();
        this._themes = [base] as MimicaGameType[];
    }
    get variant() {
        return 'mimica';
    }

    get gameModes() {
        return [GameMode.LOCAL];
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

    get rules() {
        return {
            goal: ' Fazer seu time adivinhar palavras sem falar.',
            howToPlay: `1. Dividam-se em times
2. Um jogador pega uma carta com uma palavra
3. Ele deve representar a palavra com gestos e mímica
4. O time tenta adivinhar a palavra no tempo limite
5. Pontuem conforme a dificuldade da palavra
6. Alternem quem faz a mímica a cada rodada
7. O time com mais pontos vence`,
        };
    }
}

export const MimicaGame = new Mimica();
