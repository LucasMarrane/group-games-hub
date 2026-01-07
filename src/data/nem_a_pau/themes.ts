import { IGames, ITheme } from '@appTypes/game';
import { UUID_GAMES } from '@/utils/uuid/games';
import base from '@data/nem_a_pau/default.json'
import { GameBase } from '@data/game.base';

type NemAPauGameType =  ITheme<any>;

class NemAPau extends GameBase<NemAPauGameType> implements IGames<NemAPauGameType> {  
    constructor() {
        super();
        this._themes = [base] as unknown as NemAPauGameType[];
    }
    get uuid() {
        return UUID_GAMES.nem_a_pau;
    }
    get name() {
        return 'Nem a Pau';
    }
    get hint() {
        return 'Trivia numérica';
    }

    get description() {
        return `Uma pergunta de uma Carta de Tema é lida em voz alta, e cada jogador tentará adivinhar a resposta numérica em seu turno. Se um palpite for contestado, a resposta é verificada. Se a resposta estiver certa, a carta fica com o desafiante. Se a resposta estiver errada, a carta fica com o desafiado. No final da partida, o jogador com mais cartas é o grande perdedor, enquanto todos os outros vencem!`;
    }
}

export const NemAPauGame = new NemAPau();
