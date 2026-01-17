import { useSessionStore } from '@/hooks/useSessionStore';
import { Button as SButton } from '@/@shadcn/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@shadcn/components/ui/avatar';
import { EllipsisVertical } from 'lucide-react';
import { PlayerManager } from '@/utils/manager/player.manager';
import { useState } from 'react';
import { Settings } from './player.settings';
import { withOnlineStatus } from '@/utils/hoc/withOnlineStatus';

function Button() {
    const [open, setOpen] = useState(false);
    const { player } = useSessionStore();

    return (
        <>
            <SButton variant='outline' type='button' className='h-[50px]' onClick={() => setOpen(true)}>
                {!player ? (
                    <>Entrar</>
                ) : (
                    <>
                        <Avatar className='h-8 w-8 rounded-lg grayscale'>
                             <AvatarImage src={PlayerManager.getAvatarUrl(player.avatar)} />
                            <AvatarFallback className='rounded-lg'>{PlayerManager.getAvatarFallback(player.nickname!)}</AvatarFallback>
                        </Avatar>
                        <div className='grid flex-1 text-left text-sm leading-tight m-2'>
                            <span className='truncate font-medium'>{player.nickname}</span>
                            <span className='text-muted-foreground truncate text-xs'>{player.uuid}</span>
                        </div>
                        <EllipsisVertical className='ml-auto size-4' />
                    </>
                )}
            </SButton>
            {open && (
                <Settings
                    open={open}
                    onChange={() => {
                        setOpen(false);
                    }}
                />
            )}
        </>
    );
}

export const ModalButton = withOnlineStatus(Button);
