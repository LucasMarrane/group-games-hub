import { Sparkles } from 'lucide-react';
import { PropsWithChildren } from 'react';

interface ShuffleProps extends PropsWithChildren{
    totalThemes: number;
}

export function Shuffle({children, totalThemes}: ShuffleProps) {
    return (
        <div className='bg-card rounded-3xl p-6 shadow-card'>
            <div className='flex flex-col items-center gap-3 mb-6'>
                <div className='w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-button'>
                    <Sparkles className='w-6 h-6 text-primary-foreground' />
                </div>
                <div>
                    <h2 className='font-display text-xl font-bold text-foreground'>Sortear Tema</h2>
                    <p className='text-sm text-muted-foreground'>{totalThemes} temas disponíveis</p>
                </div>
                {children}
            </div>
        </div>
    );
}
