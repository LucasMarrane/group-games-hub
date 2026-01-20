import { useMultiplayer } from '@/hooks/useMultiplayer';
import * as Game from '@components/game';
import { Icon } from '@components/game/game.icon';
import { DecisoesGame } from '@data/decisoes/theme';
import { Button } from '@shadcn/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronRight, RotateCcw, Skull, Trophy } from 'lucide-react';

export function Decisoes() {
    const { startGame, localPlayerId, gameState, changeGame: changeGameState, players, setPlayers, mode } = useMultiplayer<any>();

    const { currentCardIndex = 0, phase, step, nextPlayer, hostWon, hostGuess, actualPlayer, winner, shuffledCards = [] } = gameState ?? {};

    const questionsData = DecisoesGame.themes.flatMap((i) => i.items);

    function shuffle() {
        const shuffled = [...questionsData].sort(() => Math.random() - 0.5);
        return shuffled;
    }

    const currentQuestion = shuffledCards[currentCardIndex];

    const startNewGame = () => {
        startGame({ phase: 'playing', step: 'question', currentCardIndex: 0, shuffledCards: shuffle(), actualPlayer: localPlayerId, nextPlayer: 0 });
    };

    const startVoting = () => {
        changeGameState({ ...gameState, step: 'voting' });
    };

    const submitVote = (option: 'A' | 'B') => {
        const nextId = nextPlayer >= players.length - 1 ? 0 : nextPlayer + 1;
        const votes: any[] = gameState?.votes ?? [];
        const player = players[nextPlayer];
        let _hostGuess: any = hostGuess ?? null;
        if (player.type == 'host') {
            _hostGuess = option;
        } else {
            votes.push(option);
        }

        let hostWon = false;

        let actualStep = 'voting';

        let winner: any = null;
        if (votes.length == players.length - 1) {
            actualStep = 'results';

            winner = votes.sort((a, b) => votes.filter((v) => v === a).length - votes.filter((v) => v === b).length).pop();
            const _players = players.map((p) => {
                let result = { ...p };

                if (winner == _hostGuess && p.type == 'host') {
                    result.points!++;
                    hostWon = true;
                } else if (winner != _hostGuess && p.type != 'host') {
                    result.points!++;
                }
                return result;
            });
            setPlayers(_players);
        }
        changeGameState({ ...gameState, step: actualStep, actualPlayer: players[nextId].id, nextPlayer: nextId, votes, winner, hostGuess: _hostGuess, hostWon });
    };

    const nextRound = () => {
        if (currentCardIndex < shuffledCards.length - 1) {
            changeGameState({ ...gameState, currentCardIndex: currentCardIndex + 1, step: 'question', votes: [], hostGuess: null, hostWon: false });
        }
    };

    const resetGame = () => {
        startNewGame();
    };
    const [optionA = '', optionB = ''] = (currentQuestion?.title ?? '')?.split('OU');
    return (
        <Game.Container className='text-gradient-decisoes' game={DecisoesGame} icon={<Icon variant='decisoes' />} showMultiplayer onStart={startNewGame}>
            {phase == 'playing' && (
                <>
                    <motion.div
                        key={`palpiteiro-${currentCardIndex}`}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className='bg-card rounded-2xl border border-border overflow-hidden p-5'
                    >
                        {step === 'question' && currentQuestion && (
                            <motion.div key='question' initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className='flex-1 flex flex-col'>
                                <div className='flex-1 flex flex-col gap-4 justify-center'>
                                    <motion.div
                                        initial={{ x: -50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className='bg-gradient-to-r from-rose-500/20 to-rose-600/10 border border-rose-500/30 rounded-2xl p-6'
                                    >
                                        <span className='text-violet-400 font-bold text-lg mb-2 block'>Opção A</span>
                                        <p className='text-foreground font-display text-lg'>{optionA}</p>
                                    </motion.div>

                                    <div className='text-center'>
                                        <span className='text-muted-foreground font-display text-xl'>ou</span>
                                    </div>

                                    <motion.div
                                        initial={{ x: 50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className='bg-gradient-to-r from-violet-500/20 to-violet-600/10 border border-violet-500/30 rounded-2xl p-6'
                                    >
                                        <span className='text-violet-400 font-bold text-lg mb-2 block'>Opção B</span>
                                        <p className='text-foreground font-display text-lg'>{optionB}</p>
                                    </motion.div>
                                </div>

                                <Button onClick={startVoting} variant='decisoes' size='lg' className='mt-6'>
                                    Iniciar Votação
                                    <ChevronRight className='w-5 h-5 ml-2' />
                                </Button>
                            </motion.div>
                        )}

                        {step === 'voting' && currentQuestion && (
                            <motion.div key='voting' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className='flex-1 flex flex-col'>
                                <div className='text-center mb-6'>
                                    <h2 className='text-xl font-display font-bold text-foreground'>{currentQuestion.title}</h2>
                                    <p className='text-muted-foreground text-md'>{currentQuestion.footer}</p>
                                </div>
                                <div className='flex-1 flex flex-col gap-4 mx-2 justify-center'>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => submitVote('A')}
                                        disabled={actualPlayer != localPlayerId && mode != 'local'}
                                        className='bg-gradient-to-r from-rose-500/30 to-rose-600/20 border-2 border-rose-500/50 rounded-2xl p-6 text-left hover:shadow-lg hover:shadow-rose-500/20 transition-all'
                                    >
                                        <span className='text-rose-400 font-bold text-lg mb-2 block'>A</span>
                                        <p className='text-foreground font-display'>{optionA}</p>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => submitVote('B')}
                                        disabled={actualPlayer != localPlayerId && mode != 'local'}
                                        className='bg-gradient-to-r from-violet-500/30 to-violet-600/20 border-2 border-violet-500/50 rounded-2xl p-6 text-left hover:shadow-lg hover:shadow-violet-500/20 transition-all'
                                    >
                                        <span className='text-violet-400 font-bold text-lg mb-2 block'>B</span>
                                        <p className='text-foreground font-display'>{optionB}</p>
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'results' && (
                            <motion.div key='reveal' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='flex-1 flex flex-col items-center justify-center'>
                                <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200 }} className='text-center w-full'>
                                    <motion.div
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${hostWon ? 'gradient-decisoes shadow-glow-decisoes' : 'bg-muted'}`}
                                    >
                                        {hostWon ? <Trophy className='w-12 h-12 text-foreground' /> : <Skull className='w-12 h-12 text-muted-foreground' />}
                                    </motion.div>

                                    <h2 className='text-2xl font-display font-bold text-foreground mb-2'>{hostWon ? 'Host Acertou! 🎉' : 'Host Errou! 💀'}</h2>

                                    <p className='text-muted-foreground mb-6'>
                                        A maioria escolheu: <span className={winner === 'A' ? 'text-rose-400 font-bold' : 'text-violet-400 font-bold'}>Opção {winner}</span>
                                    </p>

                                    <div className='space-y-3'>
                                        <Button onClick={nextRound} variant='decisoes' size='lg' className='w-full'>
                                            Próxima Rodada
                                            <ChevronRight className='w-5 h-5 ml-2' />
                                        </Button>
                                        <Button onClick={resetGame} variant='outline' size='lg' className='w-full'>
                                            <RotateCcw className='w-4 h-4 mr-2' />
                                            Novo Jogo
                                        </Button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </motion.div>
                </>
            )}
        </Game.Container>
    );
}

export default Decisoes;
