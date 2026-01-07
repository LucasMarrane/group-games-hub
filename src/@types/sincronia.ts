import { IItem } from './game';

// Sincronia Types
export type SicroniaScaleTuple = [number, string];

export interface SincroniaItem extends IItem {
    scale: SicroniaScaleTuple[];
}

export interface AdaptedSicroniaTheme {
    id: string;
    title: string;
    category: string;
    scaleMin: string;
    scaleMax: string;
    sourcePack: string;
}
