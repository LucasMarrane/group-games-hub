// Sincronia Types

export type SicroniaScaleTuple = [number, string]

export interface SincroniaItem {
    id: number;
    title: string;
    category: number;
    scale: SicroniaScaleTuple[];
}

export interface AdaptedTheme {
    id: string;
    title: string;
    category: string;
    scaleMin: string;
    scaleMax: string;
    sourcePack: string;
}
