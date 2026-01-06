import { ThemeAdapter } from '@/utils/manager/theme.manager';
import { SincroniaGame } from '@data/index';
import { Tooltip, TooltipContent, TooltipTrigger } from '@shadcn/components/ui/tooltip';
import { cn } from '@shadcn/lib/utils';
import { motion } from 'framer-motion';
import { Check, Heart } from 'lucide-react';
import { PropsWithChildren, ReactNode } from 'react';

interface IBaseCard extends PropsWithChildren {
    className?: string;
}

interface CardProps extends IBaseCard {
    currentTheme: any;
    children: ReactNode;
    isUsed: boolean;
    isFavorite: boolean;
    onToggleUsed: () => void;
    onToggleFavorite: () => void;
}

export function BaseCard({ children, className }: IBaseCard) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={cn('space-y-4 theme-card group', className)}>
            {children}
        </motion.div>
    );
}

export function Card({ currentTheme, children, isUsed, isFavorite, onToggleUsed, onToggleFavorite, className = '' }: CardProps) {
    return (
        <BaseCard className={className}>
            <div className='flex items-start justify-between mb-3'>
                <h2 className='text-2xl font-display font-bold text-foreground'>{currentTheme.title}</h2>
                <div className='flex gap-1'>
                    <button
                        onClick={onToggleFavorite}
                        className={cn('p-2 rounded-full transition-all duration-200', isFavorite ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/5')}
                        aria-label={false ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                        <Heart className={cn('w-4 h-4', false && 'fill-current')} />
                    </button>
                    <button
                        onClick={onToggleUsed}
                        className={cn('p-2 rounded-full transition-all duration-200', isUsed ? 'text-accent bg-accent/10' : 'text-muted-foreground hover:text-accent hover:bg-accent/5')}
                        aria-label={false ? 'Marcar como não usado' : 'Marcar como usado'}
                    >
                        <Check className={cn('w-4 h-4', false && 'stroke-[3]')} />
                    </button>
                </div>
            </div>
            <div className='flex items-center gap-2'>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className='px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-medium'>{currentTheme.sourcePack}</span>
                    </TooltipTrigger>
                    <TooltipContent className='m-2 bg-secondary text-white max-w-sm'>{ThemeAdapter.getExpansionDescription(currentTheme.sourcePack, SincroniaGame.themes)}</TooltipContent>
                </Tooltip>
                <span className='px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium'>{currentTheme.category}</span>
            </div>

            <div className='flex items-center gap-4 pt-4 border-t border-border'>{children}</div>
        </BaseCard>
    );
}
