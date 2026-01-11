import { UUID_GAMES } from "@/utils/uuid/games";
import { IGames, ITheme } from "@appTypes/game";
import { SurtoColetivoItem } from "@appTypes/surto_coletivo";
import { GameBase } from "@data/game.base";
import base from '@data/surto_coletivo/default.json'

type SurtoColetivoGameType =  ITheme<SurtoColetivoItem>;

class SurtoColetivo extends GameBase<SurtoColetivoGameType> implements IGames<SurtoColetivoGameType> {  
    constructor() {
        super();
        this._themes = [base] as unknown as SurtoColetivoGameType[];
    }
    get uuid() {
        return UUID_GAMES.amigos_da_onca;
    }
    get name() {
        return 'Surto Coletivo';
    }
    get hint() {
        return 'O objetivo é ganhar, e ganha quem não perde, mas depende.';
    }

    get description() {
        return `Um card game multiplayer de alta velocidade onde a única regra é o caos.`;
    }
}

export const SurtoColetivoGame = new SurtoColetivo();