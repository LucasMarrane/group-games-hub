import { UUID_GAMES } from "@/utils/uuid/games";
import { IGames, ITheme } from "@appTypes/game";
import { OncaItem } from "@appTypes/onca";
import { GameBase } from "@data/game.base";
import base from '@data/onca/default.json'

type OncaGameType =  ITheme<OncaItem>;

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
}

export const OncaGame = new Onca();