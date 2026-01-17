import { PlayerManager } from '@/utils/manager/player.manager';
import { Avatar, AvatarFallback, AvatarImage } from '@shadcn/components/ui/avatar';
import { Button } from '@shadcn/components/ui/button';
import { Card, CardContent } from '@shadcn/components/ui/card';
import { cn } from '@shadcn/lib/utils';
import { motion } from 'framer-motion';

interface PlayerCardItemProps {
    name: string;
    uuid: string;
    isHost?: boolean;
    avatarIndex?: number;
    className?: string;
    children?: React.ReactNode;
    onKick?: Function;
    canKick?: boolean;
}

export function MultiplayerCard({ name, uuid, isHost = false, avatarIndex = 1, className, children, onKick, canKick }: PlayerCardItemProps) {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className={cn('w-full', className)}>
            <Card className={cn('overflow-hidden transition-all duration-200', isHost ? 'border-primary' : '')}>
                <CardContent className='p-3'>
                    <div className='flex items-center gap-3'>
                        <div className='relative flex-shrink-0'>
                            <Avatar className='w-12 h-12 rounded-lg'>
                                <AvatarImage src={PlayerManager.getAvatarUrl(avatarIndex)} className='object-cover' />
                                <AvatarFallback className='rounded-lg text-lg font-bold'>{PlayerManager.getAvatarFallback(name)}</AvatarFallback>
                            </Avatar>
                            {isHost && <div className='absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center'>H</div>}
                        </div>

                        <div className='flex-1 min-w-0'>
                            <div className='flex items-center justify-between'>
                                <h3 className='font-medium text-foreground truncate'>{name}</h3>
                            </div>

                            <div className='flex items-center gap-2 mt-1'>
                                <div className='flex items-center gap-1'>
                                    <div className='w-2 h-2 rounded-full bg-green-500'></div>
                                    <span className='text-xs text-muted-foreground'>{uuid}</span>
                                </div>
                            </div>
                        </div>

                        {!isHost && canKick && (
                            <Button variant='ghost' size='sm' onClick={() => onKick?.()} className='text-destructive hover:text-destructive'>
                                ✕
                            </Button>
                        )}
                    </div>

                    {children && <div className='mt-3 pt-3 border-t border-border'>{children}</div>}
                </CardContent>
            </Card>
        </motion.div>
    );
}
