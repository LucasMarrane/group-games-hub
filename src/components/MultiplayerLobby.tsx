import { useState } from 'react';
import { Button } from '@shadcn/components/ui/button';
import { Input } from '@shadcn/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shadcn/components/ui/card';
import { Users, Plus, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface MultiplayerLobbyProps {
    onCreateRoom: () => Promise<string>;
    onJoinRoom: (roomId: string) => void;
    players: { id: string; name: string }[];
    isHost?: boolean;
    roomId?: string | null;
}

export function MultiplayerLobby({ onCreateRoom, onJoinRoom, players, isHost = false, roomId = null }: MultiplayerLobbyProps) {
    const [joinRoomId, setJoinRoomId] = useState('');
    const [copied, setCopied] = useState(false);

    const handleCreateRoom = async () => {
        try {
            const id = await onCreateRoom();
            toast('Sala criada!', {
                description: 'Compartilhe o código com seus amigos.',
            });
        } catch (error) {
            toast('Erro', {
                description: 'Não foi possível criar a sala.',
                className: 'destructive',
            });
        }
    };

    const copyRoomId = () => {
        if (roomId) {
            navigator.clipboard.writeText(roomId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast('Código copiado!', {
                description: 'Compartilhe com seus amigos.',
            });
        }
    };

    return (
        <div className='grid gap-6 md:grid-cols-2'>
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <Plus className='w-5 h-5' />
                        Criar Sala
                    </CardTitle>
                    <CardDescription>Crie uma nova sala e convide amigos para jogar</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleCreateRoom} className='w-full' size='lg'>
                        <Share2 className='w-4 h-4 mr-2' />
                        Criar Nova Sala
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <Users className='w-5 h-5' />
                        Entrar em Sala
                    </CardTitle>
                    <CardDescription>Entre em uma sala existente com o código</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <Input placeholder='Digite o código da sala' value={joinRoomId} onChange={(e) => setJoinRoomId(e.target.value)} />
                    <Button onClick={() => onJoinRoom(joinRoomId)} className='w-full' size='lg' disabled={!joinRoomId}>
                        Entrar na Sala
                    </Button>
                </CardContent>
            </Card>

            {roomId && (
                <Card className='md:col-span-2'>
                    <CardHeader>
                        <CardTitle>Sala Ativa</CardTitle>
                        <CardDescription>Compartilhe este código com seus amigos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='flex items-center gap-2'>
                            <div className='flex-1 p-3 bg-muted rounded-lg font-mono'>{roomId}</div>
                            <Button onClick={copyRoomId} variant={copied ? 'outline' : 'default'}>
                                {copied ? 'Copiado!' : 'Copiar'}
                            </Button>
                        </div>

                        <div className='mt-4'>
                            <h3 className='font-medium mb-2'>Jogadores na sala:</h3>
                            <ul className='space-y-2'>
                                <li className='flex items-center gap-2'>
                                    <div className='w-3 h-3 rounded-full bg-green-500'></div>
                                    Você {isHost && '(Host)'}
                                </li>
                                {players.map((player, idx) => (
                                    <li key={player.id} className='flex items-center gap-2'>
                                        <div className='w-3 h-3 rounded-full bg-blue-500'></div>
                                        {player.name || `Jogador ${idx + 2}`}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
