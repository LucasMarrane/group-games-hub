import { ThemeExpansion, AdaptedTheme } from "@/@types/ito";


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
      pack.categories.forEach(cat => categoryMap.set(cat.id, cat.name));

      pack.items.forEach(item => {
        const minScale = item.scale.find(s => s[0] === 0 || s[0] === 1)?.[1] || "Min";
        const maxScale = item.scale.find(s => s[0] === 100)?.[1] || "Max";
        const categoryName = categoryMap.get(item.category) || "Geral";
        
        // ID único: nome-do-pacote-id-do-item
        const uniqueId = `${pack.name.replace(/\s+/g, '-').toLowerCase()}-${item.id}`;

        allThemes.push({
          id: uniqueId,
          title: item.title,
          category: categoryName,
          scaleMin: String(minScale),
          scaleMax: String(maxScale),
          sourcePack: pack.name // <--- Essencial para o filtro de pacotes
        });
      });
    });

    return allThemes;
  }
}