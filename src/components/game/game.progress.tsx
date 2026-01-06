import { Button } from "@shadcn/components/ui/button";
import { Check, Heart, Layers, RotateCcw } from "lucide-react";

interface ProgressBarProps {
  total: number;
  used: number;
  favorites: number;
  available: number;
  onReset: () => void;
}

export function ProgressBar({ total, used, favorites, available, onReset }: ProgressBarProps) {
     const usedPercentage = (used / total) * 100;
    return (
        <div className='bg-card rounded-2xl p-4 shadow-card'>
            {/* Progress bar */}
            <div className='mb-4'>
                <div className='flex justify-between text-sm mb-2'>
                    <span className='text-muted-foreground'>Progresso</span>
                    <span className='font-semibold text-foreground'>
                        {used} de {total}
                    </span>
                </div>
                <div className='h-3 bg-muted rounded-full overflow-hidden'>
                    <div className='h-full gradient-accent rounded-full transition-all duration-500' style={{ width: `${usedPercentage}%` }} />
                </div>
            </div>

            {/* Stats */}
            <div className='flex items-center justify-between'>
                <div className='flex gap-4'>
                    <div className='flex items-center gap-2 text-sm'>
                        <div className='w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center'>
                            <Check className='w-4 h-4 text-accent' />
                        </div>
                        <div>
                            <div className='font-semibold text-foreground'>{used}</div>
                            <div className='text-xs text-muted-foreground'>Usados</div>
                        </div>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                        <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center'>
                            <Heart className='w-4 h-4 text-primary' />
                        </div>
                        <div>
                            <div className='font-semibold text-foreground'>{favorites}</div>
                            <div className='text-xs text-muted-foreground'>Favoritos</div>
                        </div>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                        <div className='w-8 h-8 rounded-lg bg-secondary flex items-center justify-center'>
                            <Layers className='w-4 h-4 text-secondary-foreground' />
                        </div>
                        <div>
                            <div className='font-semibold text-foreground'>{available}</div>
                            <div className='text-xs text-muted-foreground'>Disponíveis</div>
                        </div>
                    </div>
                </div>

                <Button variant='ghost' size='sm' onClick={onReset} className='text-muted-foreground hover:text-destructive'>
                    <RotateCcw className='w-4 h-4 mr-1' />
                    Resetar
                </Button>
            </div>
        </div>
    );
}
