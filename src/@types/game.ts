export interface IGames<Expansion> {
    uuid: string;
    name: string;
    hint: string;
    description: string;
    themes: Expansion[];
    categories: ILabel<any>[];
    expansions: ILabel<any>[];
    getExpansionDescription: (name: string) => string;
}

export interface ILabel<T> {
    label: string;
    value: string;
    original: T
}

export interface ICategory {
    id: number;
    name: string;
    description?: string;
}
export interface IItem {
    id: number;
    title: string;
    category: number;
}
export interface ITheme<I extends IItem> {
    id: string;
    name: string;
    description: string;
    categories: ICategory[];
    items: I[];
}
