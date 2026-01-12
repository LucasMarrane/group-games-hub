import { IGames } from '@appTypes/game';
import { Button } from '@shadcn/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@shadcn/components/ui/collapsible';
import { cn } from '@shadcn/lib/utils';
import { HelpCircle } from 'lucide-react';
import { PropsWithChildren, ReactNode } from 'react';
import * as Player from '@components/player';

interface ContainerProps extends PropsWithChildren {
    game: IGames<any>;
    className?: string;
    icon?: ReactNode;
}

export function Container({ children, game, icon, className = '' }: ContainerProps) {
    return (
        <div className='min-h-full p-4 flex flex-col gap-6'>
            <div className='text-center'>
                <div>
                    <Collapsible>
                        <div className='flex flex-col items-center justify-between gap-4 px-4'>
                            {icon}
                            <div className='flex items-center justify-center'>
                                <h1 className={cn('text-3xl font-display font-bold mb-2', className)}>{game.name}</h1>
                                <CollapsibleTrigger asChild>
                                    <Button variant='outline' size='icon' className='size-8 ml-2'>
                                        <HelpCircle />
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                            <p className='text-muted-foreground text-sm'>{game.hint}</p>
                            <Player.ModalButton />
                        </div>
                        <CollapsibleContent className='flex flex-col gap-2 mt-2 text-muted-foreground text-sm'>
                            <p>{game.description}</p>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </div>
            {children}
        </div>
    );
}
