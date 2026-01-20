import { IGames } from '@appTypes/game';
import { Button } from '@shadcn/components/ui/button';
import { cn } from '@shadcn/lib/utils';
import { BookOpen, Eye, Play, Trophy, Users2 } from 'lucide-react';
import { PropsWithChildren, ReactNode, useMemo } from 'react';
import * as Player from '@components/player';
import * as Game from '@components/game';
import { AnimatePresence, motion } from 'framer-motion';
import { useMultiplayer } from '@/hooks/useMultiplayer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@shadcn/components/ui/collapsible';
import { useMultiplayerStore } from '@/providers/multiplayer/multiplayer.store';

interface ContainerProps extends PropsWithChildren {
    game: IGames<any>;
    className?: string;
    icon?: ReactNode;
    onStart?: Function;
    showMultiplayer?: boolean;
}

export function Container({ children, game, icon, className = '', onStart = () => {}, showMultiplayer = false }: ContainerProps) {
    const { players } = useMultiplayerStore();
    const { isHost, gameState, changeGame } = useMultiplayer<any>();
    const { actualPlayer } = gameState ?? {};

    const sortedPlayers = useMemo(() => [...players].sort((a, b) => b.points! - a.points!), [players]);

    return (
        <div className='min-h-full p-4 flex flex-col gap-4'>
            <div className='bg-card rounded-xl p-4 border border-border shadow-sm'>
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-3'>
                    <div className='flex items-center gap-3'>
                        {icon}
                        <div className='flex flex-col'>
                            <div className='flex items-center'>
                                <h1 className={cn('text-xl font-display font-bold text-foreground', className)}>{game.name}</h1>
                                <Game.Rules
                                    gameName={game.name}
                                    rule={game.rules}
                                    description={game.description}
                                    trigger={
                                        <Button variant='outline' size='icon' className='size-8 ml-2'>
                                            <BookOpen />
                                        </Button>
                                    }
                                />
                            </div>
                            <p className='text-muted-foreground text-xs mt-1'>{game.hint}</p>
                        </div>
                    </div>
                    <div className='flex flex-shrink-0 sm:items-center justify-center'>
                        <Player.ModalButton />
                    </div>
                </div>
            </div>
            <AnimatePresence mode='wait'>
                {!gameState?.phase && showMultiplayer && (
                    <motion.div key='play' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className='flex-1 space-y-4'>
                        <Game.Multiplayer variant={game.variant as any} />

                        <Button
                            variant={game.variant as any}
                            size='xl'
                            className='w-full'
                            onClick={onStart as any}
                            disabled={!isHost || players.length < game.minPlayers || players.length > game.maxPlayers}
                        >
                            Começar Jogo
                            <Play className='w-5 h-5' />
                        </Button>
                    </motion.div>
                )}

                {gameState?.phase == 'playing' && (
                    <motion.div key={`players-card`} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className='bg-card rounded-2xl border border-border overflow-hidden'>
                        <Collapsible defaultOpen>
                            <div className='p-4'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full'>
                                        <Users2 className='w-4 h-4 text-white' />
                                        <span className='text-white font-bold'>Vez de {sortedPlayers.find((p) => p.id == actualPlayer)?.name}</span>
                                    </div>
                                    <div className='flex justify-end'>
                                        <div
                                            className='flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full mr-2 pointer'
                                            onClick={() => {
                                                changeGame({ ...gameState, phase: 'finished' });
                                            }}
                                        >
                                            <Trophy className='w-4 h-4 text-white' />
                                            <span className='text-white font-bold'>Finalizar</span>
                                        </div>
                                        <CollapsibleTrigger asChild>
                                            <div className='flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full'>
                                                <Eye className='w-4 h-4 text-white' />
                                            </div>
                                        </CollapsibleTrigger>
                                    </div>
                                </div>
                            </div>

                            <CollapsibleContent>
                                {/* Question */}
                                <div className='p-6'>
                                    <div className='flex gap-2 overflow-x-auto pb-2'>
                                        <ul className='space-y-2 flex gap-2'>
                                            {sortedPlayers.map((player, idx) => (
                                                <Player.GameCard player={player} key={`player-${idx}`} isPlaying={actualPlayer == player.id} />
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </motion.div>
                )}

                {gameState?.phase === 'finished' && <Player.Scoreboard key={'score'} players={sortedPlayers} />}
                {children}
            </AnimatePresence>
        </div>
    );
}
