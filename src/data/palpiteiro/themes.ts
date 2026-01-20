import { IGames, ITheme } from '@appTypes/game';
import { UUID_GAMES } from '@/utils/uuid/games';
import base from '@data/palpiteiro/default.json';
import { GameBase } from '@data/game.base';
import { PalpiteiroItem } from '@appTypes/palpiteiro';
import { GameMode } from '@/providers/multiplayer/multiplayer.store';

type PalpiteiroGameType = ITheme<PalpiteiroItem>;

class Palpiteiro extends GameBase<PalpiteiroGameType> implements IGames<PalpiteiroGameType> {
    constructor() {
        super();
        this._themes = [base] as unknown as PalpiteiroGameType[];
    }
    get variant() {
        return 'palpiteiro';
    }
    get gameModes() {
        return [GameMode.LOCAL, GameMode.ONLINE];
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

    get rules() {
        return {
            goal: 'Adivinhar números e evitar receber pontos.',
            howToPlay: `1. Uma pergunta numérica é lida (ex: "Quantos dentes tem um tubarão?")\n 2. Cada jogador dá um palpite em ordem\n 3. O próximo palpite deve ser MAIOR que o anterior\n 4. Se alguém duvidar do palpite, verifica-se a resposta real\n 5. Se o palpite estiver errado, o jogador recebe a carta (1 "pato")\n 6. Se o palpite estiver certo, quem duvidou recebe a carta\n 7. O jogo termina quando se atinge um número definido de patos\n 8. Quem tiver MENOS cartas vence`,
        };
    }
}

export const PalpiteiroGame = new Palpiteiro();
