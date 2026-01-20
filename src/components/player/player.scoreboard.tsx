import { Player } from '@/providers/multiplayer/types';
import { PlayerManager } from '@/utils/manager/player.manager';
import { Avatar, AvatarFallback, AvatarImage } from '@shadcn/components/ui/avatar';
import { Card, CardContent } from '@shadcn/components/ui/card';
import { cn } from '@shadcn/lib/utils';
import { motion } from 'framer-motion';
import { Medal, Trophy } from 'lucide-react';

export interface IScoreboardProps {
    players: Player[];
    className?: string;
}

export function Scoreboard({ players, className }: IScoreboardProps) {
    const sortedPlayers = [...players];
    const podiumPlayers = sortedPlayers.slice(0, players.length > 2 ? 3 : players.length);
    let remainingPlayers = players.length > 3 ? sortedPlayers.slice(3) : [];
    

    return (
        <div className={cn('w-full space-y-6', className)}>
            {/* Podium */}
            <div className='flex justify-center gap-4 md:gap-6'>
                {podiumPlayers.map((player, index) => {
                    const positions = [
                        { place: '1º', bgColor: 'bg-yellow-400', textColor: 'text-yellow-800', height: 'h-32 md:h-40' },
                        { place: '2º', bgColor: 'bg-gray-300', textColor: 'text-gray-700', height: 'h-24 md:h-32' },
                        { place: '3º', bgColor: 'bg-amber-700', textColor: 'text-amber-100', height: 'h-20 md:h-28' },
                    ];
                    
                    const position = positions[index];

                    return (
                        <motion.div key={player.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className='flex flex-col items-center'>
                            <div className={`w-16 md:w-20 rounded-t-lg ${position.bgColor} ${position.height} flex flex-col items-center  pb-2`}>
                                <h3 className={`text-xs md:text-sm font-bold ${position.textColor} mt-3`}>{position.place}</h3>
                            </div>

                            <Card className='w-16 h-16 md:w-20 md:h-20 rounded-full -mt-8 md:-mt-10 border-2 border-yellow-400'>
                                <CardContent className='p-1 flex flex-col items-center justify-center h-full'>
                                    <Avatar className='w-8 h-8 md:w-12 md:h-12 rounded-full'>
                                        <AvatarImage src={PlayerManager.getAvatarUrl(player.avatar ?? 1)} />
                                        <AvatarFallback className='rounded-full text-xs md:text-sm'>{PlayerManager.getAvatarFallback(player.name)}</AvatarFallback>
                                    </Avatar>
                                </CardContent>
                            </Card>

                            <div className='text-center mt-2 flex flex-col items-center justify-center'>
                                <h3 className='font-medium text-sm truncate max-w-[80px] md:max-w-[100px]'>{player.name}</h3>
                                <div className='flex items-center gap-1'>
                                    <Trophy className='w-3 h-3 text-yellow-500' />
                                    <span className='text-xs font-bold text-yellow-600'>{player?.points ?? 0}</span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Remaining Players List */}
            {remainingPlayers.length > 0 && (
                <div className='space-y-2'>
                    <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider'>Classificação</h3>
                    <div className='space-y-1  grid rid-cols-1 lg:grid-cols-4 md:grid-cols-2 '>
                        {remainingPlayers.map((player, index) => (
                            <motion.div
                                key={player.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: (index + 3) * 0.05 }}
                                className='flex items-center justify-between bg-card/50 backdrop-blur rounded-lg p-3'
                            >
                                <div className='flex items-center gap-3'>
                                    <div className='flex items-center justify-center w-8 h-8 rounded-full bg-muted'>
                                        <span className='text-xs font-bold text-muted-foreground'>#{index + 4}</span>
                                    </div>

                                    <div className='flex items-center gap-2'>
                                        <Avatar className='w-8 h-8 rounded-full'>
                                            <AvatarImage src={PlayerManager.getAvatarUrl(player.avatar ?? 1)} />
                                            <AvatarFallback className='rounded-full text-xs'>{PlayerManager.getAvatarFallback(player.name)}</AvatarFallback>
                                        </Avatar>
                                        <span className='font-medium text-sm'>{player.name}</span>
                                    </div>
                                </div>

                                <div className='flex items-center gap-1'>
                                    <Medal className='w-4 h-4 text-muted-foreground' />
                                    <span className='text-sm font-bold text-muted-foreground'>{player?.points ?? 0}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
