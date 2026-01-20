import { GameMode } from "@/providers/multiplayer/multiplayer.store";
import { UUID_GAMES } from "@/utils/uuid/games";
import { IGames, ITheme } from "@appTypes/game";
import { VexameItem } from "@appTypes/vexame";
import { GameBase } from "@data/game.base";
import base from './default.json';

export type VexameGameType = ITheme<VexameItem>;

class Vexame extends GameBase<VexameGameType> implements IGames<VexameGameType> {
    constructor() {
        super();
        this._themes = [base] as VexameGameType[];
    }
    get variant() {
        return 'vexame';
    }

    get gameModes() {
        return [GameMode.SINGLE];
    }

    get uuid() {
        return UUID_GAMES.vexame;
    }
    get name() {
        return 'Vexame';
    }
    get hint() {
        return 'Obedeça a carta ou destrua seu fígado. A dignidade é opcional.';
    }
    get description() {
        return `Um jogo de cartas socialmente destrutivo onde a escolha é simples: cumprir um desafio absurdo ou beber a punição. Teste os limites da sua vergonha alheia, exponha seus amigos e tente terminar a noite sem ser bloqueado em todas as redes sociais. Não há vencedores, apenas sobreviventes.`;
    }
    get rules() {
        return {
            goal: 'Humilhar seus amigos e evitar o coma alcoólico enquanto ri da desgraça alheia.',
            howToPlay: `1. Sentem-se em roda e coloquem as bebidas no centro (longe de eletrônicos caros).\n 2. O jogador da vez aperta o botão.\n 3. Leia o desafio em voz alta com entonação dramática.\n 4. ESCOLHA: Cumpra o desafio (FAÇA) ou aceite a punição (BEBA).\n 5. Se falhar ou recusar, beba a quantidade indicada.\n 6. O jogo segue em sentido horário até que a bebida acabe, alguém chore ou a polícia chegue.`,
        };
    }
}

export const VexameGame = new Vexame();