import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  Shuffle, Sparkles } from 'lucide-react';
import { AdaptedTheme } from '@appTypes/ito';
import { Button } from '@shadcn/components/ui/button';
import { ItoThemes } from '@data/index';
import { ThemeAdapter } from '@/utils/manager/themeManager';
import { Tooltip, TooltipContent, TooltipTrigger } from '@shadcn/components/ui/tooltip';


export const SincroniaGame = () => {
    const themes = useMemo(() => new ThemeAdapter(ItoThemes).getAdaptedThemes(), []);
    const [currentTheme, setCurrentTheme] = useState<AdaptedTheme | null>(null);

    const pickRandomTheme = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * themes.length);
        setCurrentTheme(themes[randomIndex]);
    }, [themes]);

    return (
        <div className='min-h-full p-4 flex flex-col gap-6'>
            {/* Header */}
            <div className='text-center'>
                <h1 className='text-3xl font-display font-bold text-gradient-sincronia mb-2'>Sincronia</h1>
                <p className='text-muted-foreground text-sm'>Ordenem seus números baseados no tema!</p>
            </div>

            {/* Theme Section */}
            <motion.div layout className='bg-card rounded-2xl p-6 border border-border'>
                <div className='flex items-center justify-between mb-4'>
                    <span className='text-xs uppercase tracking-wider text-muted-foreground'>Tema Atual</span>
                    <div>
                        {/* <Button variant='outline' size='sm' onClick={pickRandomTheme} className='gap-2 mr-2'>
                            <Eye className='w-4 h-4' />
                            Mostrar todos os temas
                        </Button> */}
                        <Button variant='sincronia' size='sm' onClick={pickRandomTheme} className='gap-2'>
                            <Shuffle className='w-4 h-4' />
                            Novo Tema
                        </Button>
                    </div>
                </div>
                <AnimatePresence mode='wait'>
                    {currentTheme ? (
                        <motion.div key={currentTheme.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className='space-y-4'>
                            <h2 className='text-2xl font-display font-bold text-foreground'>{currentTheme.title}</h2>
                            <div className='flex items-center gap-2'>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className='px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-medium'>{currentTheme.sourcePack}</span>
                                    </TooltipTrigger>
                                    <TooltipContent className='m-2 bg-secondary text-white max-w-sm'>{ThemeAdapter.getExpansionDescription(currentTheme.sourcePack, ItoThemes)}</TooltipContent>
                                </Tooltip>
                                <span className='px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium'>{currentTheme.category}</span>
                            </div>

                            {/* Scale */}
                            <div className='flex items-center gap-4 pt-4 border-t border-border'>
                                <div className='flex-1 text-center'>
                                    <div className='text-2xl font-bold text-primary'>1</div>
                                    <div className='text-sm text-muted-foreground'>{currentTheme.scaleMin}</div>
                                </div>
                                <div className='flex-1 h-2 rounded-full gradient-sincronia-progress' />
                                <div className='flex-1 text-center'>
                                    <div className='text-2xl font-bold text-sincronia-max'>100</div>
                                    <div className='text-sm text-muted-foreground'>{currentTheme.scaleMax}</div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-center py-8 text-muted-foreground'>
                            <Sparkles className='w-12 h-12 mx-auto mb-4 opacity-50' />
                            <p>Clique em "Novo Tema" para começar!</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default SincroniaGame;
