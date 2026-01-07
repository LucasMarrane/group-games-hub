import { IGames, ITheme } from '@appTypes/game';
import { UUID_GAMES } from '@/utils/uuid/games';
import base from '@data/palpiteiro/default.json'
import { GameBase } from '@data/game.base';
import { PalpiteiroItem } from '@appTypes/palpiteiro';

type PalpiteiroGameType =  ITheme<PalpiteiroItem>;

class Palpliteiro extends GameBase<PalpiteiroGameType> implements IGames<PalpiteiroGameType> {  
    constructor() {
        super();
        this._themes = [base] as unknown as PalpiteiroGameType[];
    }
    get uuid() {
        return UUID_GAMES.palpiteiro;
    }
    get name() {
        return 'Palpiteiro';
    }
    get hint() {
        return 'Trivia numérica, arrisque-se com uma resposta e veja o caos sendo instaurado.';
    }

    get description() {
        return `Uma pergunta de uma Carta de Tema é lida em voz alta, e cada jogador tentará adivinhar a resposta numérica em seu turno. Se um palpite for contestado, a resposta é verificada. Se a resposta estiver certa, a carta fica com o desafiante. Se a resposta estiver errada, a carta fica com o desafiado. No final da partida, o jogador com mais cartas é o grande perdedor, enquanto todos os outros vencem!`;
    }
}

export const PalpiteiroGame = new Palpliteiro();
