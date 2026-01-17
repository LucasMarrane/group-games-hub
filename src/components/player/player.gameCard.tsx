import { Player } from '@/hooks/useMultiplayer';
import { PlayerManager } from '@/utils/manager/player.manager';
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarFallback, AvatarImage } from '@shadcn/components/ui/avatar';
import { Card, CardContent } from '@shadcn/components/ui/card';
import { cn } from '@shadcn/lib/utils';
import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';

interface IGameCardProps extends PropsWithChildren {
    player: Player;
    className?: string;
    isPlaying?: boolean;
}

export function GameCard({ player, children, className, isPlaying }: IGameCardProps) {
    const isHost = player.type == 'host';
    return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className={cn('w-full', className)}>
            <Card className={cn('overflow-hidden transition-all duration-200', isHost ? 'border-primary' : '')}>
                <CardContent className='p-3'>
                    <div className='flex items-center gap-3'>
                        <div className='relative flex-shrink-0 w-15'>
                            <Avatar className='w-full rounded-lg'>
                                <AvatarImage src={PlayerManager.getAvatarUrl(player.avatar)} className='object-cover' />
                                <AvatarFallback className='rounded-lg text-lg font-bold'>{PlayerManager.getAvatarFallback(player.name)}</AvatarFallback>
                            </Avatar>
                            {isHost && <div className='absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center'>H</div>}
                        </div>

                        <div className='flex-1 min-w-0'>
                            <div className='flex items-center justify-between'>
                                <h3 className='font-medium text-foreground truncate'>{player.name}</h3>
                            </div>

                            <div className='flex items-center gap-2 mt-1'>
                                {isPlaying ? (
                                    <span className='text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded'>Jogando</span>
                                ) : (
                                    <span className='text-xs bg-primary/10 text-primary px-2 py-0.5 rounded'>Aguardando</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {children && <div className='mt-3 pt-3 border-t border-border'>{children}</div>}
                </CardContent>
            </Card>
        </motion.div>
    );
}
