import * as Game from '@components/game';
import { OncaGame } from '@data/onca/theme';

export function Onca() {
    return <Game.Container className='text-gradient-onca' game={OncaGame}></Game.Container>;
}

export default Onca;
