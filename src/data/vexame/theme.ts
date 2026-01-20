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
        return 'sincronia';
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
        return 'Em equipe, ordene os números baseados no tema!';
    }

    get description() {
        return `Cada jogador recebe um conjunto de cartas numéricas e o objetivo é cooperar para colocá-las em ordem crescente. Os jogadores podem discutir e dar dicas a outros, sugerindo algo com base no tema sorteado. Por exemplo, quanto melhor a culinária japonesa, assim, quanto maior o número, mais popular é o prato!`;
    }

    get rules() {
        return {
            goal: 'Colocar cartas numeradas em ordem crescente com base em um tema.',
            howToPlay: `1. Cada jogador recebe cartas numeradas de 1 a 100\n 2. Um tema é sorteado (ex: "Popularidade de pratos japoneses")\n 3. Discutam o tema e onde cada número se encaixaria\n 4. Tentem colocar as cartas em ordem crescente na mesa\n 5. Revezem-se para jogar uma carta por rodada\n 6. Se errarem a ordem, perdem pontos\n 7. O jogo termina quando todas as cartas forem jogadas`,
        };
    }
}

export const VexameGame = new Vexame();