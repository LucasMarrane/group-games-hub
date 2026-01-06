import base from './default.json'


interface IGames<Expansion> {
    name: string;
    hint: string;
    description: string;
    themes: Expansion[];
}

class Mimica implements IGames<any> {
    private _themes = [base] ;
    get name() {
        return 'Mímica';
    }
    get hint() {
        return 'Represente e adivinhe para pontuar';
    }

    get description() {
        return `Pular, balançar os braços, sinalizar. Vale tudo para fazer com que descubram sua mímica, menos falar! `;
    }

    get themes() {
        return this._themes;
    }
}

export const MimicaGame = new Mimica();
