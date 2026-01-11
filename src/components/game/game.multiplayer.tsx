import { useMultiplayer } from '@/hooks/useMultiplayer';
import { useSessionStore } from '@/hooks/useSessionStore';
import { GameCardVariant } from '@components/GameCard';
import { Button } from '@shadcn/components/ui/button';
import { Input } from '@shadcn/components/ui/input';
import { motion } from 'framer-motion';
import { House, LogIn, Plus, Share2, Trash, Users, Wifi } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export interface MultiplayerProps {
    variant: GameCardVariant;
}

type MultiplayerPhase = 'local' | 'online' | 'multiplayer_setup' | 'join_room';

export function Multiplayer({ variant }: MultiplayerProps) {
    const { player } = useSessionStore();
    const [phase, setPhase] = useState<MultiplayerPhase>('local');
    const [joinRoomId, setJoinRoomId] = useState('');
    const [copied, setCopied] = useState(false);
    const { isHost, roomId, localPlayerId, players, createRoom, joinRoom, setMode, mode, addOfflinePlayer, removePlayer, closeRoom } = useMultiplayer();

    const [newPlayerName, setNewPlayerName] = useState('');

    const handleAddOffline = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (newPlayerName.trim()) {
            addOfflinePlayer(newPlayerName);
            setNewPlayerName('');
        }
    };

    const handleJoinRoom = () => {
        if (joinRoomId.trim()) {
            joinRoom(joinRoomId.trim());
            setPhase('multiplayer_setup');
            toast.success('Conectando à sala...');
        }
    };

    const copyRoomId = () => {
        if (roomId) {
            navigator.clipboard.writeText(roomId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleCreateRoom = async () => {
        try {
             await createRoom();
            toast.success('Sala criada! Compartilhe o código com seus amigos.');
            setPhase('multiplayer_setup');
        } catch (error) {
            toast.error('Erro ao criar sala');
        }
    };

    function openOnline() {
        if (!player?.uuid) {
            toast.warning('Você precisa adicionar um nickname pra jogar online');
            return;
        }
        setMode('online');
        setPhase('online');
    }

    function openLocal() {
        setMode('local');
        setPhase('local');
    }

    function closeThisRoom() {
        setMode('local');
        setPhase('local');
        closeRoom();
    }

    return (
        <>
            {phase == 'local' && (
                <div className='bg-card rounded-2xl p-6 border border-border space-y-4'>
                    <div className='flex items-center justify-between'>
                        <div className='flex flex-col gap-2 text-muted-foreground'>
                            <h3 className='font-medium text-foreground'>Jogar offline</h3>
                            <p className='text-sm text-muted-foreground'>Crie uma sala para jogar com amigos</p>
                        </div>

                        <Button variant='glass' size='sm' onClick={openOnline}>
                            <Wifi className='w-4 h-4' />
                            Online
                        </Button>
                    </div>

                    <div className='flex gap-2'>
                        <Button
                            variant='outline'
                            className='flex-1'
                            onClick={() => {
                                handleCreateRoom();
                            }}
                        >
                            <Share2 className='w-5 h-5 mr-2' /> Criar Sala
                        </Button>
                    </div>
                </div>
            )}
            {phase == 'online' && (
                <div className='bg-card rounded-2xl p-6 border border-border space-y-4'>
                    <div className='flex items-center justify-between'>
                        <div className='flex flex-col gap-2 text-muted-foreground'>
                            <h3 className='font-medium text-foreground'>Jogar Online</h3>
                            <p className='text-sm text-muted-foreground'>Crie uma sala ou entre em uma existente para jogar com amigos</p>
                        </div>

                        <Button variant='glass' size='sm' onClick={openLocal}>
                            <House className='w-4 h-4' />
                            Local
                        </Button>
                    </div>

                    <div className='flex gap-2'>
                        <Button variant={variant} className='flex-1' onClick={() => setPhase('join_room')}>
                            <LogIn className='w-5 h-5 mr-2' /> Entrar em Sala
                        </Button>

                        <Button
                            variant='outline'
                            className='flex-1'
                            onClick={() => {
                                setMode('online');
                                handleCreateRoom();
                            }}
                        >
                            <Share2 className='w-5 h-5 mr-2' /> Criar Sala
                        </Button>
                    </div>
                </div>
            )}
            {phase == 'join_room' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className='flex-1 space-y-4'>
                    <div className='bg-card rounded-2xl p-6 border border-border'>
                        <h2 className='text-xl font-bold mb-4 text-center'>Entrar em uma Sala</h2>
                        <p className='text-muted-foreground mb-4 text-center'>Insira o código da sala para se conectar</p>

                        <div className='space-y-4'>
                            <Input placeholder='Código da sala' value={joinRoomId} onChange={(e) => setJoinRoomId(e.target.value)} className='text-center' />

                            <div className='flex gap-2'>
                                <Button variant='outline' className='flex-1' onClick={openLocal}>
                                    Voltar
                                </Button>

                                <Button variant='palpiteiro' className='flex-1' onClick={handleJoinRoom} disabled={!joinRoomId.trim()}>
                                    <LogIn className='w-4 h-4 mr-2' /> Entrar
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {phase == 'multiplayer_setup' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className='flex-1 space-y-4'>
                    <div className='bg-card rounded-2xl p-6 border border-border text-center'>
                        <div className='flex items-center justify-between'>
                            <div className='flex flex-col'>
                                <h2 className='text-xl font-bold mb-4'>Lobby</h2>
                            </div>

                            <Button variant='glass' size='sm' onClick={closeThisRoom}>
                                <Trash className='w-4 h-4 text-danger' />
                                Sair da sala
                            </Button>
                        </div>

                        {mode == 'online' ? (
                            <>
                                {isHost && (
                                    <>
                                        <p className='text-muted-foreground mb-4'>Compartilhe este código com seus amigos para que eles possam entrar:</p>

                                        <div className='bg-muted rounded-lg p-4 mb-4'>
                                            <code className='text-lg font-mono'>{roomId}</code>
                                        </div>

                                        <Button onClick={copyRoomId} variant={copied ? 'outline' : 'palpiteiro'} className='w-full mb-4'>
                                            {copied ? 'Copiado!' : 'Copiar Código'}
                                        </Button>
                                    </>
                                ) }
                            </>
                        ) : (
                            <div className='glass-card p-4 rounded-xl space-y-3'>
                                <div className='flex items-center gap-2 mb-2'>
                                    <Users className={`'w-5 h-5 text-${variant}'`} />
                                    <span className='font-medium'>Adicionar jogador local</span>
                                </div>
                                <div className='flex gap-2'>
                                    <Input
                                        value={newPlayerName}
                                        onChange={(e) => setNewPlayerName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddOffline()}
                                        placeholder='Nome do jogador'
                                        className='flex-1'
                                        maxLength={15}
                                    />
                                    <Button onClick={handleAddOffline} variant={variant} size='icon'>
                                        <Plus className='w-5 h-5' />
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className='text-left mb-4'>
                            <h3 className='font-medium mb-2'>Jogadores na sala:</h3>
                            <ul className='space-y-2'>
                                {players.map((player) => (
                                    <motion.div
                                        key={player.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className='flex items-center justify-between p-2 rounded-lg bg-caotiqueira/10'
                                    >
                                        <span className='flex items-center gap-2'>
                                            <div className={`w-3 h-3 rounded-full bg-${variant} ${player.id === localPlayerId ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                                            {player.name}
                                        </span>
                                        {(player.id != localPlayerId && isHost) && (
                                            <Button variant='ghost' size='sm' onClick={() => removePlayer(player.id)} className='text-destructive hover:text-destructive'>
                                                ✕
                                            </Button>
                                        )}
                                    </motion.div>
                                ))}
                            </ul>
                        </div>
                        {!isHost && <p className='text-sm text-muted-foreground'>Aguardando o host iniciar o jogo...</p>}
                    </div>
                </motion.div>
            )}
        </>
    );
}
