import {  AdaptedTheme } from '@appTypes/sincronia';
import { SincroniaGame } from '@/data';
import { ThemeAdapter } from '@/utils/manager/theme.manager';
import { useState, useEffect, useCallback } from 'react';


// Chave do LocalStorage
const STORAGE_KEY = 'ito_game_data';

export function useThemes() {
    // 1. Inicializa o Adapter e gera os temas planos uma única vez (ou useMemo se expansões mudarem)
    const initialAllThemes = new ThemeAdapter(SincroniaGame.themes).getAdaptedThemes();

    const [state, setState] = useState(() => {
        // Tenta carregar persistência
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                return {
                    usedThemes: new Set(parsed.usedThemes || []),
                    favoriteThemes: new Set(parsed.favoriteThemes || []),
                };
            }
        }
        return { usedThemes: new Set(), favoriteThemes: new Set() };
    });

    // Estados de UI
    const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
    const [hideUsed, setHideUsed] = useState(false);

    // Efeito de Persistência
    useEffect(() => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                usedThemes: Array.from(state.usedThemes),
                favoriteThemes: Array.from(state.favoriteThemes),
            }),
        );
    }, [state]);

    // --- Funções de Manipulação (Idênticas à sua lógica original) ---

    const toggleUsed = useCallback((id: string) => {
        setState((prev) => {
            const newUsed = new Set(prev.usedThemes);
            newUsed.has(id) ? newUsed.delete(id) : newUsed.add(id);
            return { ...prev, usedThemes: newUsed };
        });
    }, []);

    const toggleFavorite = useCallback((id: string) => {
        setState((prev) => {
            const newFavs = new Set(prev.favoriteThemes);
            newFavs.has(id) ? newFavs.delete(id) : newFavs.add(id);
            return { ...prev, favoriteThemes: newFavs };
        });
    }, []);

    const resetUsed = useCallback(() => {
        setState((prev) => ({ ...prev, usedThemes: new Set() }));
    }, []);

    // --- Filtros ---

    const getFilteredThemes = useCallback(() => {
        return initialAllThemes.filter((theme) => {
            if (selectedCategory !== 'all' && theme.category !== selectedCategory) return false;
            if (showOnlyFavorites && !state.favoriteThemes.has(theme.id)) return false;
            if (hideUsed && state.usedThemes.has(theme.id)) return false;

            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return theme.title.toLowerCase().includes(query) || theme.scaleMin.toLowerCase().includes(query) || theme.scaleMax.toLowerCase().includes(query);
            }
            return true;
        });
    }, [selectedCategory, showOnlyFavorites, hideUsed, searchQuery, state.favoriteThemes, state.usedThemes, initialAllThemes]);

    const getRandomTheme = useCallback((): AdaptedTheme | null => {
        const available = getFilteredThemes().filter((t) => !state.usedThemes.has(t.id));
        if (available.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * available.length);
        return available[randomIndex];
    }, [getFilteredThemes, state.usedThemes]);

    // Extrair lista única de categorias para o filtro
    const availableCategories = Array.from(new Set(initialAllThemes.map((t) => t.category)));

    return {
        themes: getFilteredThemes(),
        allCategories: availableCategories, // Útil para montar o <select> de filtro
        usedThemes: state.usedThemes,
        favoriteThemes: state.favoriteThemes,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        showOnlyFavorites,
        setShowOnlyFavorites,
        hideUsed,
        setHideUsed,
        toggleUsed,
        toggleFavorite,
        resetUsed,
        getRandomTheme,
        stats: {
            total: initialAllThemes.length,
            used: state.usedThemes.size,
            favorites: state.favoriteThemes.size,
            available: initialAllThemes.length - state.usedThemes.size,
        },
    };
}
