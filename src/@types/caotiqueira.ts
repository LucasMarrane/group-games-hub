import { IItem } from './game';

//Caotiqueira types
export interface CaotiqueiraItem extends IItem {}
export interface AdaptedCaotiqueiraTheme {
    id: string;
    title: string;
    category: string;
}


export interface CaotiqueiraPlayer {
  id: string;
  name: string;
  score: number;
}
