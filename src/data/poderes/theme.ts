import { GameMode } from '@/providers/multiplayer/multiplayer.store';
import { UUID_GAMES } from '@/utils/uuid/games';
import { IGames, ITheme } from '@appTypes/game';
import { GameBase } from '@data/game.base';
import base from './default.json';
import { PoderesItem } from '@appTypes/poderes';

type PoderesGameType = ITheme<PoderesItem>;

class Poderes extends GameBase<PoderesGameType> implements IGames<PoderesGameType> {
    constructor() {
        super();
        this._themes = [base] as unknown as PoderesGameType[];
    }
  
    get variant() {
        return 'onca';
    }
    get minPlayers(){
        return 2;
    }

    get gameModes() {
        return [GameMode.LOCAL, GameMode.ONLINE];
    }
    get uuid() {
        return UUID_GAMES.poderes;
    }
    get name() {
        return 'Destruidor de Poderes'}
    get hint() {
        return 'Destrua super poderes com criatividade.';
    }

    get description() {
        return `Em cada turno, um super poder é sorteado. Cada jogador deve usar a sua imaginação para destruir o super poder.`;
    }

    get rules() {
        return {
            goal: 'Destruir o super poder',
            howToPlay: `1. Um super poder é sorteado
2. Todos descreve como destruir.
3. Todos votam secretamente em quem acham que combina mais
4. Os votos são revelados simultaneamente
5. Quem tiver mais votos recebe um ponto
6. O jogo continua com novas cartas
7. Quem tiver MAIS pontos no final vence`,
        };
    }
}

export const PoderesGame = new Poderes();
