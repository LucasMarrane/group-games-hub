import base from './default.json';

interface IGames<Expansion> {
    name: string;
    hint: string;
    description: string;
    themes: Expansion[];
}

class NemAPau implements IGames<any> {
    private _themes = [base] ;
    get name() {
        return 'Nem a Pau';
    }
    get hint() {
        return 'Trivia numérica';
    }

    get description() {
        return `Uma pergunta de uma Carta de Tema é lida em voz alta, e cada jogador tentará adivinhar a resposta numérica em seu turno. Se um palpite for contestado, a resposta é verificada. Se a resposta estiver certa, a carta fica com o desafiante. Se a resposta estiver errada, a carta fica com o desafiado. No final da partida, o jogador com mais cartas é o grande perdedor, enquanto todos os outros vencem!`;
    }

    get themes() {
        return this._themes;
    }
}

export const NemAPauGame = new NemAPau();


