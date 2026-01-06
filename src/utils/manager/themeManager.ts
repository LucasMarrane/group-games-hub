import { ThemeExpansion, AdaptedTheme } from '@/@types/ito';

export class ThemeAdapter {
    private expansions: ThemeExpansion[];

    constructor(expansions: ThemeExpansion[]) {
        this.expansions = expansions;
    }

    public getAdaptedThemes(): AdaptedTheme[] {
        const allThemes: AdaptedTheme[] = [];

        this.expansions.forEach((pack) => {
            // Mapa para converter ID da categoria em Nome
            const categoryMap = new Map<number, string>();
            pack.categories.forEach((cat) => categoryMap.set(cat.id, cat.name));

            pack.items.forEach((item) => {
                const scale = new Map<number, string>(item.scale);
                const minScale = scale.get(1) ?? 'Minímo';
                const maxScale = scale.get(100) ?? 'Maxímo';
                const categoryName = categoryMap.get(item.category) || 'Geral';

                // ID único: nome-do-pacote-id-do-item
                const uniqueId = `${pack.name.replace(/\s+/g, '-').toLowerCase()}-${item.id}`;

                allThemes.push({
                    id: uniqueId,
                    title: item.title,
                    category: categoryName,
                    scaleMin: String(minScale),
                    scaleMax: String(maxScale),
                    sourcePack: pack.name,
                });
            });
        });

        return allThemes;
    }

    public static getExpansionDescription(name: string, expansions: ThemeExpansion[]) {
        return expansions.find((e) => e.name == name)?.description;
    }
}
