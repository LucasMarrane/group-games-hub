import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, Shuffle } from 'lucide-react';
import { AdaptedSicroniaTheme } from '@appTypes/sincronia';
import { Button } from '@shadcn/components/ui/button';
import { SincroniaGame } from '@/data';
import * as Game from '@components/game';
import { paginate } from '@/utils/pagination';
import { reset, SincroniaStore, toggleFavorite, toggleUsed, useSincronia } from './sincronia.store';
import { cn } from '@shadcn/lib/utils';
import { sincroniaAdapter } from './sicronia.adapter';

export function Sincronia() {
    const { hideUsed, showOnlyFavorites, favoriteThemes, usedThemes } = useSincronia();
    const themes = useMemo(() => sincroniaAdapter(SincroniaGame.themes), []);
    const [currentTheme, setCurrentTheme] = useState<AdaptedSicroniaTheme | null>(null);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState({ query: '', expansion: { selected: 'all', hiden: false }, category: { selected: 'all', hiden: false } });

    const getFilteredThemes = useMemo(
        () => (themes: AdaptedSicroniaTheme[]) => {
            return themes.filter((theme) => {
                const [expansion] = theme.id.split('-');
                if (filter?.expansion.selected !== 'all' && expansion !== filter?.expansion.selected) return false;
                if (showOnlyFavorites && !favoriteThemes!.includes(theme.id)) return false;
                if (hideUsed && usedThemes!.includes(theme.id)) return false;
                if (filter.query) {
                    const query = filter.query.toLowerCase();
                    return theme.title.toLowerCase().includes(query) || theme.scaleMin.toLowerCase().includes(query) || theme.scaleMax.toLowerCase().includes(query);
                }
                return true;
            });
        },
        [filter, hideUsed, showOnlyFavorites],
    );

    const _filteredThemes = getFilteredThemes(themes);

    const pickRandomTheme = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * _filteredThemes.length);
        setCurrentTheme(_filteredThemes[randomIndex]);
    }, [_filteredThemes]);

    const themesPaginate = paginate(_filteredThemes, page, 24);

    return (
        <Game.Container className='text-gradient-sincronia' game={SincroniaGame}>
            <Game.Shuffle totalThemes={_filteredThemes.length}>
                {currentTheme ? (
                    <>
                        <Game.Card
                            className='border w-full'
                            isFavorite={new Set(favoriteThemes)?.has(currentTheme.id)!}
                            isUsed={new Set(usedThemes)?.has(currentTheme.id)!}
                            currentTheme={currentTheme}
                            onToggleFavorite={() => toggleFavorite(currentTheme.id)}
                            onToggleUsed={() => toggleUsed(currentTheme.id)}
                            expansionDescription={SincroniaGame.getExpansionDescription(currentTheme.sourcePack)!}
                        >
                            <div className='flex-1 text-center'>
                                <div className='text-2xl font-bold text-primary'>1</div>
                                <div className='text-sm text-muted-foreground'>{currentTheme.scaleMin}</div>
                            </div>
                            <div className='flex-1 h-2 rounded-full gradient-sincronia-progress' />
                            <div className='flex-1 text-center'>
                                <div className='text-2xl font-bold text-sincronia-max'>100</div>
                                <div className='text-sm text-muted-foreground'>{currentTheme.scaleMax}</div>
                            </div>
                        </Game.Card>

                        <div className='flex w-full gap-3'>
                            <Button onClick={pickRandomTheme} disabled={_filteredThemes.length === 0} variant='outline' className='flex-1'>
                                <Shuffle className='w-4 h-4 mr-2' />
                                Sortear Outro
                            </Button>
                            <Button
                                onClick={() => {
                                    toggleUsed(currentTheme.id);
                                    pickRandomTheme();
                                }}
                                disabled={usedThemes?.includes(currentTheme.id)!}
                                className='flex-1 gradient-accent border-0'
                            >
                                <Check className='w-4 h-4 mr-2' />
                                Usar e Sortear
                            </Button>
                        </div>
                    </>
                ) : (
                    <Button onClick={pickRandomTheme} disabled={_filteredThemes.length === 0} className='w-full h-16 text-lg font-display gradient-primary border-0 shadow-button'>
                        <Shuffle className={cn('w-5 h-5 mr-2')} />
                        {_filteredThemes.length > 0 ? 'Sortear Tema' : 'Nenhum tema disponível'}
                    </Button>
                )}
            </Game.Shuffle>
            <Game.ProgressBar
                available={_filteredThemes.filter((t) => !usedThemes?.includes(t.id)).length}
                favorites={favoriteThemes?.length!}
                used={usedThemes?.length!}
                total={_filteredThemes.length}
                onReset={reset}
            />
            <motion.div layout className='bg-card rounded-2xl p-6 border border-border'>
                <div className='flex flex-col justify-between mb-4'>
                    <Game.SearchBar
                        onToggleHideUsed={() => SincroniaStore.setState((prev) => ({ ...prev, hideUsed: !prev.hideUsed }))}
                        onToggleFavorites={() => SincroniaStore.setState((prev) => ({ ...prev, showOnlyFavorites: !prev.showOnlyFavorites }))}
                        onChange={(query) => setFilter((prev) => ({ ...prev, query }))}
                        hideUsed={hideUsed}
                        value={filter.query}
                        showOnlyFavorites={showOnlyFavorites}
                    />
                    <span className='text-xs m-2 uppercase tracking-wider text-muted-foreground'>Expansões</span>
                    <Game.Category
                        onSelect={(e) => {
                            setFilter((prev) => ({ ...prev, expansion: { ...prev.expansion, selected: e } }));
                        }}
                        itens={SincroniaGame.expansions}
                        selected={filter.expansion.selected || 'all'}
                    />
                    {/* <span className='text-xs m-2 uppercase tracking-wider text-muted-foreground'>Categorias</span>
                    <Game.Category
                        onSelect={(e) => {
                            setFilter((prev) => ({ ...prev, category: { ...prev.category, selected: e } }));
                        }}
                        itens={SincroniaGame.categories}
                        selected={filter.category.selected || 'all'}
                    /> */}
                </div>
            </motion.div>

            <section>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='font-display text-lg font-semibold text-foreground'>
                        {_filteredThemes.length} {_filteredThemes.length === 1 ? 'tema' : 'temas'}
                    </h2>
                </div>

                {themesPaginate.data.length > 0 ? (
                    <>
                        <Game.Pagination page={page} totalPages={themesPaginate.totalPages} setPage={setPage} />
                        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                            {themesPaginate.data.map((theme, index) => (
                                <div key={theme.id} className='animate-slide-up' style={{ animationDelay: `${index * 50}ms` }}>
                                    <Game.Card
                                        isFavorite={new Set(favoriteThemes)?.has(theme.id)!}
                                        isUsed={new Set(usedThemes)?.has(theme.id)!}
                                        currentTheme={theme}
                                        onToggleFavorite={() => toggleFavorite(theme.id)}
                                        onToggleUsed={() => toggleUsed(theme.id)}
                                        expansionDescription={SincroniaGame.getExpansionDescription(theme.sourcePack)!}
                                    >
                                        <div className='flex-1 text-center'>
                                            <div className='text-2xl font-bold text-primary'>1</div>
                                            <div className='text-sm text-muted-foreground'>{theme.scaleMin}</div>
                                        </div>
                                        <div className='flex-1 h-2 rounded-full gradient-sincronia-progress' />
                                        <div className='flex-1 text-center'>
                                            <div className='text-2xl font-bold text-sincronia-max'>100</div>
                                            <div className='text-sm text-muted-foreground'>{theme.scaleMax}</div>
                                        </div>
                                    </Game.Card>
                                </div>
                            ))}
                        </div>
                        <Game.Pagination page={page} totalPages={themesPaginate.totalPages} setPage={setPage} />
                    </>
                ) : (
                    <div className='text-center py-12'>
                        <p className='text-muted-foreground'>Nenhum tema encontrado com os filtros atuais.</p>
                    </div>
                )}
            </section>
        </Game.Container>
    );
}

export default Sincronia;
