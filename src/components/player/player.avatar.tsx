import { useState } from 'react';
import { Button } from '@shadcn/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shadcn/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@shadcn/components/ui/avatar';
import { cn } from '@shadcn/lib/utils';
import * as Game from '@components/game';
import { leftFillNum, PlayerManager } from '@/utils/manager/player.manager';

interface IAvatarSelectorProps {
    spriteIndex?: number;
    rows?: number;
    columns?: number;
    onSelect?: (index: number) => void;
    trigger?: React.ReactNode;
    className?: string;
}

export function AvatarSelector({ spriteIndex = 1, rows = 5, columns = 5, onSelect, trigger, className }: IAvatarSelectorProps) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(spriteIndex);
    const [page, setPage] = useState(1);

    const handleSelect = (index: number) => {
        setSelected(index);
        onSelect?.(index);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant='outline' className={cn('p-0 w-10 h-10 rounded-full overflow-hidden', className)}>
                        <Avatar className='w-full h-full'>
                            <AvatarImage src={PlayerManager.getAvatarUrl(selected)} />
                            <AvatarFallback>AV</AvatarFallback>
                        </Avatar>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className='max-w-md'>
                <DialogHeader>
                    <DialogTitle>Escolha seu Avatar</DialogTitle>
                </DialogHeader>
                <div className='grid grid-cols-5 gap-2 p-2'>
                    {Array.from({ length: rows * columns }).map((_, idx) => {
                        const index = 25 * (page - 1 )+ idx;

                        const isSelected = index === selected - 1;

                        return (
                            <Button key={index} variant={isSelected ? 'default' : 'outline'} className='p-0 w-16 h-16 rounded-lg overflow-hidden relative' onClick={() => handleSelect(index + 1)}>
                                <div
                                    className='absolute inset-0 bg-cover bg-no-repeat'
                                    style={{
                                        backgroundImage: `url('${PlayerManager.getAvatarUrl(index)}')`,
                                    }}
                                />
                            </Button>
                        );
                    })}
                </div>
                <Game.Pagination page={page} setPage={(p: number) => setPage(p)} totalPages={5} />
            </DialogContent>
        </Dialog>
    );
}
