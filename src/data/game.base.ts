import { ITheme } from "@appTypes/game";

export abstract class GameBase<T extends ITheme<any>> {
    protected _themes: T[] = [];

    get themes() {
        return this._themes;
    }

    get categories() {
        return this._themes.flatMap((i) => i.categories.map((c) => ({ label: c.name, value: `${i.id}-${c.id}`, original: c })));
    }

    get expansions() {
        return this._themes.map((i) => ({ label: i.name, value: i.id, original: i }));
    }

    public getExpansionDescription(name: string) {
        return this._themes.find((e) => e.name == name)?.description!;
    }
}