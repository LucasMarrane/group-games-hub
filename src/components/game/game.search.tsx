import { Input } from '@shadcn/components/ui/input';
import { cn } from '@shadcn/lib/utils';
import { EyeOff, Heart, Search } from 'lucide-react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    showOnlyFavorites: boolean;
    onToggleFavorites: () => void;
    hideUsed: boolean;
    onToggleHideUsed: () => void;
}

export function SearchBar({ value, onChange, showOnlyFavorites, onToggleFavorites, hideUsed, onToggleHideUsed }: SearchBarProps) {
    return (
        <div className='flex gap-2'>
            <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
                <Input type='text' placeholder='Buscar temas...' value={value} onChange={(e) => onChange(e.target.value)} className='pl-10 h-12 rounded-xl border-border bg-card' />
            </div>
            <button
                onClick={onToggleFavorites}
                className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200',
                    showOnlyFavorites ? 'gradient-primary text-primary-foreground shadow-button' : 'bg-card border border-border text-muted-foreground hover:text-primary',
                )}
                aria-label='Mostrar apenas favoritos'
            >
                <Heart className={cn('w-5 h-5', showOnlyFavorites && 'fill-current')} />
            </button>
            <button
                onClick={onToggleHideUsed}
                className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200',
                    hideUsed ? 'gradient-accent text-accent-foreground' : 'bg-card border border-border text-muted-foreground hover:text-accent',
                )}
                aria-label='Esconder temas usados'
            >
                <EyeOff className='w-5 h-5' />
            </button>
        </div>
    );
}
