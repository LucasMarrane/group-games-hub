import { SessionStore } from '@/utils/entities/session';
import { PlayerManager } from '@/utils/manager/player.manager';
import { Label } from '@radix-ui/react-label';
import { Button } from '@shadcn/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@shadcn/components/ui/dialog';
import { Input } from '@shadcn/components/ui/input';
import { UserPen, IdCard } from 'lucide-react';
import { useEffect } from 'react';
import * as Yup from 'yup';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSessionStore } from '@/hooks/useSessionStore';
import { AvatarSelector } from './player.avatar';

const playerSchema = Yup.object({
    nickname: Yup.string().default(''),
    uuid: Yup.string().default(''),
    avatar: Yup.number().default(1),
});

export interface ISettingsProps {
    open: boolean;
    onChange: Function;
}
export function Settings({ open, onChange }: ISettingsProps) {
    const { player } = useSessionStore();

    const _defaults = { ...playerSchema.getDefault(), ...(player ?? {}) };

    const { register, setValue, handleSubmit, reset, control } = useForm({ resolver: yupResolver(playerSchema), mode: 'all', reValidateMode: 'onSubmit', defaultValues: _defaults as any });

    const { avatar } = useWatch({ control });

    function close() {
        onChange();
    }
    const submit = handleSubmit(async (form) => {
        await PlayerManager.createPlayer(form.nickname, form.avatar);
        close();
    });

    useEffect(() => {
        setValue('uuid', player?.uuid);
        setValue('nickname', player?.nickname);
    }, [player]);

    return (
        <Dialog open={open} onOpenChange={close}>
            <form>
                <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader>
                        <DialogTitle>Editar perfil</DialogTitle>
                        <DialogDescription>Edite seu perfil de jogador aqui.</DialogDescription>
                        <DialogClose onClick={close} />
                    </DialogHeader>
                    <div className='grid gap-4'>
                        <div className='grid gap-3'>
                            <Label>Avatar</Label>
                            <AvatarSelector spriteIndex={avatar} onSelect={(index) => setValue('avatar', index)}  className='w-30 h-30'/>
                        </div>
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
                            <Button
                                variant='outline'
                                onClick={() => {
                                    close();
                                    reset(playerSchema.getDefault());
                                    SessionStore.setState({ player: null });
                                }}
                            >
                                Logout
                            </Button>
                        )}

                        <Button variant='destructive' onClick={close}>
                            Cancelar
                        </Button>

                        <Button type='submit' variant='secondary' onClick={submit}>
                            Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}
