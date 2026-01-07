import { IItem } from './game';

//Onca types
export interface OncaItem extends IItem {}
export interface AdaptedOncaTheme {
    id: string;
    title: string;
    category: string;
}


export interface OncaPlayer {
  id: string;
  name: string;
  votes: number;
}