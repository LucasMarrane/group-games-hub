import * as Game from '@components/game';
import { DecisoesGame } from '@data/decisoes/theme';

export function Decisoes() {
    return <Game.Container className='text-gradient-decisoes' game={DecisoesGame}></Game.Container>;
}

export default Decisoes;
