import { IItem } from './game';

// Mímica  Types
export interface MimicaItem extends IItem {
    value: number;
}
export interface AdaptedMimicaTheme {
    id: number;
    word: string;
    category: number;
    points: number;
}

export interface MimicaTeam {
    name: string;
    score: number;
    color: string;
}
