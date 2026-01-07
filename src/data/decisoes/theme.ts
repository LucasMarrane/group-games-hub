import { UUID_GAMES } from "@/utils/uuid/games";
import { DecisoesItem } from "@appTypes/decisoes";
import { IGames, ITheme } from "@appTypes/game";

import { GameBase } from "@data/game.base";
import base from '@data/decisoes/default.json'

type DecisoesGameType =  ITheme<DecisoesItem>;

class Decisoes extends GameBase<DecisoesGameType> implements IGames<DecisoesGameType> {  
    constructor() {
        super();
        this._themes = [base] as unknown as DecisoesGameType[];
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
}

export const DecisoesGame = new Decisoes();