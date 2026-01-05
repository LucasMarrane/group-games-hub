// Sincronia (ITO) Types
export interface RawCategory {
    id: number;
    name: string;
}

export interface RawScaleTuple extends Array<string | number> {
    0: number;
    1: string;
}

export interface RawThemeItem {
    id: number;
    title: string;
    category: number;
    scale: [number, string][];
}

export interface ThemeExpansion {
    name: string;
    description: string;
    categories: RawCategory[];
    items: RawThemeItem[];
}

export interface AdaptedTheme {
    id: string;
    title: string;
    category: string;
    scaleMin: string;
    scaleMax: string;
    sourcePack: string;
}
