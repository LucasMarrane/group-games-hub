export interface IGames<Expansion> {
    uuid: string;
    name: string;
    hint: string;
    description: string;
    themes: Expansion[];
}

export interface ILabel<T>{
    label: string;
    value: T
}