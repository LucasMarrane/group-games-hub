import { IItem } from './game';

// Nem a Pato Types
export interface PalpiteiroItem extends IItem {
    answer: number;
    value: number;
}

export interface AdaptedPalpiteiroTheme {
    id: number;
    theme: string;
    value: number;
    answer: number;
    category: string;
}

export interface PalpiteiroPlayer {
    id: string;
    name: string;
    ducks: number;
}
