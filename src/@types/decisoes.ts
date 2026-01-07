import { IItem } from './game';

//Decisoes types
export interface DecisoesItem extends IItem {}
export interface AdaptedDecisoesTheme {
    id: string;
    title: string;
    category: string;
}

export interface DecisoesVote {
    visceralVoterId: number;
    option: 'A' | 'B';
}
