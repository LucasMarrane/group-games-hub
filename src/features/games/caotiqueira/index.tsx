import * as Game from '@components/game';
import { CaotiqueiraGame } from '@data/caotiqueira/theme';

export function Caotiqueira() {
    return <Game.Container className='text-gradient-caotiqueira' game={CaotiqueiraGame}></Game.Container>;
}

export default Caotiqueira;
