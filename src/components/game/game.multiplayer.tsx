import { useMultiplayer } from '@/hooks/useMultiplayer';
import { useSessionStore } from '@/hooks/useSessionStore';
import { PlayerManager } from '@/utils/manager/player.manager';
import { GameCardVariant } from '@components/GameCard';
import * as Player from '@components/player';
import { Button } from '@shadcn/components/ui/button';
import { Input } from '@shadcn/components/ui/input';
import { motion } from 'framer-motion';
import { House, LogIn, Plus, Share2, Trash, Users, Wifi } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export interface MultiplayerProps {
    variant: GameCardVariant;
}

type MultiplayerPhase = 'local' | 'online' | 'multiplayer_setup' | 'join_room' | 'server_setup' | 'server_connect';

export function Multiplayer({ variant }: MultiplayerProps) {
    const { player } = useSessionStore();
    const [phase, setPhase] = useState<MultiplayerPhase>('local');
    const [joinRoomId, setJoinRoomId] = useState('');
    const [copied, setCopied] = useState(false);
    const [serverUrl, setServerUrl] = useState('ws://localhost:8080');
    const { isHost, roomId, localPlayerId, players, createRoom, joinRoom, setMode, mode, closeRoom, removePlayer } = useMultiplayer();

    const [newPlayerName, setNewPlayerName] = useState('');

    const handleAddOffline = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (newPlayerName.trim()) {
            setNewPlayerName('');
            joinRoom('local-room', PlayerManager.randomPlayer(newPlayerName.trim()));
        }
    };

    const handleJoinRoom = () => {
        if (joinRoomId.trim()) {
            joinRoom(joinRoomId.trim(), { ...player, name: player?.nickname } as any);
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
            if (!player?.uuid) {
                toast.warning('Você precisa adicionar um nickname pra jogar.');
                return;
            }
            await createRoom();
            toast.success('Sala criada! Compartilhe o código com seus amigos.');
            setPhase('multiplayer_setup');
        } catch (error) {
            console.log(error);
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

    // function openServer() {
    //     setMode('server');
    //     setPhase('server_connect');
    // }

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

                        <div className='flex gap-2'>
                            <Button variant='glass' size='sm' onClick={openOnline}>
                                <Wifi className='w-4 h-4' />
                                Online
                            </Button>
                            {/* <Button variant='glass' size='sm' onClick={openServer}>
                                <Server className='w-4 h-4' />
                                Servidor
                            </Button> */}
                        </div>
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

                        <div className='flex gap-2'>
                            <Button variant='glass' size='sm' onClick={openLocal}>
                                <House className='w-4 h-4' />
                                Local
                            </Button>
                            {/* <Button variant='glass' size='sm' onClick={openServer}>
                                <Server className='w-4 h-4' />
                                Servidor
                            </Button> */}
                        </div>
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

                    {/* <Button variant='outline' className='w-full mt-2' onClick={handleReconnect} disabled={isReconnecting}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${isReconnecting ? 'animate-spin' : ''}`} />
                        {isReconnecting ? 'Reconectando...' : 'Reconectar'}
                    </Button> */}
                </div>
            )}
            {phase == 'server_connect' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className='flex-1 space-y-4'>
                    <div className='bg-card rounded-2xl p-6 border border-border'>
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='text-xl font-bold'>Conectar ao Servidor</h2>

                            <div className='flex gap-2'>
                                <Button variant='glass' size='sm' onClick={openLocal}>
                                    <House className='w-4 h-4' />
                                    Local
                                </Button>
                                <Button variant='glass' size='sm' onClick={openOnline}>
                                    <Wifi className='w-4 h-4' />
                                    Online
                                </Button>
                            </div>
                        </div>

                        <p className='text-muted-foreground mb-4'>Conecte-se a um servidor local para jogar com amigos na mesma rede</p>

                        <div className='space-y-4'>
                            <div>
                                <label className='text-sm text-muted-foreground mb-2 block'>URL do Servidor</label>
                                <Input placeholder='ws://localhost:8080' value={serverUrl} onChange={(e) => setServerUrl(e.target.value)} className='text-center' />
                            </div>

                            <div className='flex gap-2'>
                                <Button variant='outline' className='flex-1' onClick={openLocal}>
                                    Voltar
                                </Button>

                                {/* <Button variant={variant} className='flex-1' onClick={handleConnectToServer} disabled={serverConnected}>
                                    <Globe className='w-4 h-4 mr-2' />
                                    {serverConnected ? 'Conectado' : 'Conectar'}
                                </Button> */}
                            </div>

                            {/* <Button variant='outline' className='w-full' onClick={handleReconnect} disabled={isReconnecting || !serverConnected}>
                                <RefreshCw className={`w-4 h-4 mr-2 ${isReconnecting ? 'animate-spin' : ''}`} />
                                {isReconnecting ? 'Reconectando...' : 'Reconectar à Sala'}
                            </Button> */}
                        </div>
                    </div>
                </motion.div>
            )}
            {/* {phase == 'server_setup' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className='flex-1 space-y-4'>
                    <div className='bg-card rounded-2xl p-6 border border-border text-center'>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='flex flex-col'>
                                <h2 className='text-xl font-bold mb-4'>Servidor Local</h2>
                            </div>

                            <Button
                                variant='glass'
                                size='sm'
                                onClick={() => {
                                    disconnectFromServer();
                                    setPhase('server_connect');
                                }}
                            >
                                <Trash className='w-4 h-4 text-danger' />
                                Desconectar
                            </Button>
                        </div>

                        <div className='glass-card p-4 rounded-xl space-y-3 mb-4'>
                            <div className='flex items-center gap-2 mb-2'>
                                <Server className={`'w-5 h-5 text-${variant}'`} />
                                <span className='font-medium'>Opções do Servidor</span>
                            </div>

                            <div className='grid grid-cols-2 gap-2'>
                                <Button variant={variant} onClick={handleCreateServerRoom}>
                                    Criar Sala
                                </Button>
                                <Button variant='outline' onClick={handleJoinServerRoom}>
                                    Entrar em Sala
                                </Button>
                            </div>

                            <Button variant='outline' className='w-full mt-2' onClick={handleReconnect} disabled={isReconnecting}>
                                <RefreshCw className={`w-4 h-4 mr-2 ${isReconnecting ? 'animate-spin' : ''}`} />
                                {isReconnecting ? 'Reconectando...' : 'Reconectar'}
                            </Button>
                        </div>

                        <div className='text-left mb-4'>
                            <h3 className='font-medium mb-2'>Jogadores na sala:</h3>
                            <ul className='space-y-2  flex grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
                                {players.map((player) => (
                                    <Player.MultiplayerCard
                                        name={player.name}
                                        uuid={player.id}
                                        isHost={player.type == 'host'}
                                        canKick={player.id != localPlayerId && isHost}
                                        avatarIndex={player?.avatar ?? 1}
                                        onKick={() => removePlayer(player.id)}
                                    />
                                ))}
                            </ul>
                        </div>

                        {!isHost && <p className='text-sm text-muted-foreground'>Aguardando o host iniciar o jogo...</p>}
                    </div>
                </motion.div>
            )} */}
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
                                )}
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
                            <ul className='space-y-2  flex grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
                                {players.map((player) => (
                                    <Player.MultiplayerCard
                                        name={player.name}
                                        uuid={player.id}
                                        isHost={player.type == 'host'}
                                        canKick={player.id != localPlayerId && isHost}
                                        avatarIndex={player?.avatar ?? 1}
                                        onKick={() => removePlayer(player)}
                                    />
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
