import { UUID_GAMES } from '@/utils/uuid/games';
import { DecisoesItem } from '@appTypes/decisoes';
import { IGames, ITheme } from '@appTypes/game';

import { GameBase } from '@data/game.base';
import base from '@data/decisoes/default.json';
import { GameMode } from '@/providers/multiplayer/multiplayer.store';

type DecisoesGameType = ITheme<DecisoesItem>;

class Decisoes extends GameBase<DecisoesGameType> implements IGames<DecisoesGameType> {
    constructor() {
        super();
        this._themes = [base] as unknown as DecisoesGameType[];
    }
    get variant() {
        return 'decisoes';
    }

    get gameModes() {
        return [GameMode.LOCAL, GameMode.ONLINE];
    }
    get uuid() {
        return UUID_GAMES.pessimas_decisoes;
    }
    get name() {
        return 'Pessímas decisões';
    }
    get hint() {
        return 'Escolher a opção menos pior julgue as escolhas dos seus amigos.';
    }

    get description() {
        return `Em cada turno, uma tema é sorteado. Esse tema possui uma pergunta e você deve escolher uma,  caso  o Host acerte o que a maioria acha menos pior ele ganha o ponto, caso contrario os jogadores ganham.`;
    }

    get rules() {
        return {
            goal: 'Adivinhar o que a maioria escolheria.',
            howToPlay: `1. Uma pergunta com duas opções é lida
2. Cada jogador vota em qual opção acha que a maioria escolherá
3. O "Host" tenta adivinhar a escolha da maioria
4. Se o Host acertar, ele ganha um ponto
5. Se errar, todos os outros jogadores ganham um ponto
6. O jogo continua com novas perguntas
7. Quem tiver mais pontos no final vence`,
        };
    }
}

export const DecisoesGame = new Decisoes();
