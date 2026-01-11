import { Input } from '@shadcn/components/ui/input';
import { Label } from '@shadcn/components/ui/label';
import { Button as SButton } from '@shadcn/components/ui/button';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@shadcn/components/ui/dialog';
import { Avatar, AvatarFallback } from '@shadcn/components/ui/avatar';
import { EllipsisVertical, IdCard, UserPen } from 'lucide-react';
import { useSessionStore } from '@/hooks/useSessionStore';
import { withOnlineStatus } from '@/utils/hoc/withOnlineStatus';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PlayerManager } from '@/utils/manager/player.manager';
import { SessionStore } from '@/utils/entities/session';
import { useEffect, useState } from 'react';

const playerSchema = Yup.object({
    nickname: Yup.string().default(''),
    uuid: Yup.string().default(''),
});

function Button() {
    const [open, setOpen] = useState(false);
    const { player } = useSessionStore();

    const _defaults = { ...playerSchema.getDefault(), ...(player ?? {}) };

    const { register, setValue, handleSubmit, reset } = useForm({ resolver: yupResolver(playerSchema), mode: 'all', reValidateMode: 'onSubmit', defaultValues: _defaults as any });

    function onOpenChange() {
        setOpen((o) => !o);
    }
    function close() {
        setOpen(false);
    }
    const submit = handleSubmit(async (form) => {
        await PlayerManager.createPlayer(form.nickname);
        close();
    });

    useEffect(() => {
        setValue('uuid', player?.uuid);
        setValue('nickname', player?.nickname);
    }, [player]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <SButton variant='outline' type='button' className='h-[50px]' onClick={() => setOpen(true)}>
                {!player ? (
                    <>Entrar</>
                ) : (
                    <>
                        <Avatar className='h-8 w-8 rounded-lg grayscale'>
                            <AvatarFallback className='rounded-lg'>{PlayerManager.getAvatar(player.nickname!)}</AvatarFallback>
                        </Avatar>
                        <div className='grid flex-1 text-left text-sm leading-tight m-2'>
                            <span className='truncate font-medium'>{player.nickname}</span>
                            <span className='text-muted-foreground truncate text-xs'>{player.uuid}</span>
                        </div>
                        <EllipsisVertical className='ml-auto size-4' />
                    </>
                )}
            </SButton>

            <form>
                <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader>
                        <DialogTitle>Editar perfil</DialogTitle>
                        <DialogDescription>Edite seu perfil de jogador aqui.</DialogDescription>
                        <DialogClose onClick={close} />
                    </DialogHeader>
                    <div className='grid gap-4'>
                        <div className='grid gap-3'>
                            <Label htmlFor='nickname'>Apelido</Label>
                            <div className='relative'>
                                <UserPen className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
                                <Input {...register('nickname')} className='pl-10 ' id='nickname' name='nickname' required />
                            </div>
                        </div>

                        <div className='grid gap-3'>
                            <Label htmlFor='uuid'>ID</Label>
                            <div className='relative'>
                                <IdCard className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
                                <Input {...register('uuid')} className='pl-10 ' id='uuid' name='uuid' disabled />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        {player && (
                            <SButton
                                variant='outline'
                                onClick={() => {
                                    close();
                                    reset(playerSchema.getDefault());
                                    SessionStore.setState({ player: null });
                                }}
                            >
                                Logout
                            </SButton>
                        )}

                        <SButton variant='destructive' onClick={close}>
                            Cancelar
                        </SButton>

                        <SButton type='submit' variant='secondary' onClick={submit}>
                            Salvar
                        </SButton>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}

export const ModalButton = withOnlineStatus(Button);
