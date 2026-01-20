import { useMultiplayer } from '@/hooks/useMultiplayer';
import * as Game from '@components/game';
import { Icon } from '@components/game/game.icon';
import { OncaGame } from '@data/onca/theme';
import { Button } from '@shadcn/components/ui/button';
import { motion } from 'framer-motion';
import { Bird, Cat, ChevronRight, RotateCcw, Trophy } from 'lucide-react';
import { useState } from 'react';

export function Onca() {
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const { startGame, localPlayerId, gameState, changeGame: changeGameState, players, mode, setPlayers } = useMultiplayer<any>();

    const { currentCardIndex = 0, phase, step, actualPlayer, nextPlayer, shuffledCards = [] } = gameState ?? {};

    const questionsData = OncaGame.themes.flatMap((i) => i.items);

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
        setSelectedPlayerId(null);
    };

    const submitVote = () => {
        if (selectedPlayerId) {
            const nextId = nextPlayer >= players.length - 1 ? 0 : nextPlayer + 1;

            const votes: any[] = gameState?.votes ?? [];
            votes.push(selectedPlayerId);
            let actualStep = 'voting';
            let winner: any = null;
            if (votes.length == players.length) {
                actualStep = 'results';

                winner = players.find((i) => i.id == votes.sort((a, b) => votes.filter((v) => v === a).length - votes.filter((v) => v === b).length).pop());
                const _players = players.map((p) => {
                    let result = { ...p };

                    if (p.id == winner.id) {
                        result.points!++;
                    }
                    return result;
                });
                setPlayers(_players);
            }
            changeGameState({ ...gameState, step: actualStep, actualPlayer: players[nextId].id, nextPlayer: nextId, votes, winner });

            setSelectedPlayerId(null);
        }
    };

    const nextQuestion = () => {
        if (currentCardIndex < shuffledCards.length - 1) {
            changeGameState({ ...gameState, currentCardIndex: currentCardIndex + 1, step: 'question', votes: [] });
        }
    };

    const resetGame = () => {
        startNewGame();
    };

    console.log(currentQuestion)

    return (
        <Game.Container className='text-gradient-onca' game={OncaGame} icon={<Icon variant='onca' />} onStart={startNewGame} showMultiplayer>
            {phase == 'playing' && (
                <>
                    <motion.div
                        key={`palpiteiro-${currentCardIndex}`}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className='bg-card rounded-2xl border border-border overflow-hidden p-5'
                    >
                        {step == 'question' && (
                            <motion.div
                                key='question'
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className='flex-1 flex flex-col items-center justify-center'
                            >
                                <div className='text-center mb-8'>
                                    <span className='text-onca text-sm font-medium'>
                                        Pergunta {currentCardIndex + 1} de {shuffledCards.length}
                                    </span>
                                </div>

                                <motion.div
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className='bg-card/80 backdrop-blur rounded-3xl p-8 shadow-glow-onca mb-8 max-w-md'
                                >
                                    <Cat className='w-12 h-12 mx-auto mb-4 text-onca' />
                                    <p className='text-xl font-display font-semibold text-foreground text-center'>{currentQuestion.title}</p>
                                </motion.div>

                                <Button onClick={startVoting} variant='onca' size='lg'>
                                    Votar
                                    <ChevronRight className='w-5 h-5 ml-2' />
                                </Button>
                            </motion.div>
                        )}

                        {step == 'voting' && (
                            <motion.div key='voting' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className='flex-1 flex flex-col'>
                                <div className='text-center mb-6'>
                                    <h2 className='text-xl font-display font-bold text-foreground mb-2'>Quem combina mais?</h2>
                                    <p className='text-muted-foreground text-sm'>{currentQuestion?.title}</p>
                                </div>

                                <div className='grid grid-cols-2 gap-3 mb-6'>
                                    {players.map((player) => (
                                        <motion.button
                                            key={player.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSelectedPlayerId(player.id)}
                                            className={`p-4 rounded-2xl border-2 transition-all ${selectedPlayerId === player.id ? 'border-onca bg-onca/20 shadow-glow-onca' : 'border-border bg-card/50'}`}
                                        >
                                            <span className='font-display font-semibold text-foreground'>{player.name}</span>
                                        </motion.button>
                                    ))}
                                </div>

                                <Button onClick={submitVote} disabled={!selectedPlayerId || (actualPlayer != localPlayerId && mode != 'local')} variant='onca' size='lg' className='mt-auto'>
                                    Confirmar Voto
                                </Button>
                            </motion.div>
                        )}

                        {step === 'results' && (
                            <motion.div key='results' initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className='flex-1 flex flex-col'>
                                <div className='text-center mb-6'>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 200 }}
                                        className='w-20 h-20 mx-auto mb-4 rounded-full gradient-onca shadow-glow-onca flex items-center justify-center'
                                    >
                                        <Trophy className='w-10 h-10 text-foreground' />
                                    </motion.div>
                                    <h2 className='text-2xl font-display font-bold text-foreground mb-1'>O escolhido foi...</h2>
                                    <p className='text-3xl font-display font-bold text-onca'>{gameState?.winner?.name}</p>
                                    <div className='bg-muted rounded-xl mt-4 p-2 flex items-center text-center'>
                                        <Bird className='mr-2' />
                                        <div>
                                            <p className='text-md text-white text-muted'>{currentQuestion.footer}</p>
                                            <p className='text-muted-foreground text-sm italic font-bold'>Ass: Nelson, o pombo da discórdia</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </>
            )}

            {phase && !['voting', 'question', 'finished'].includes(step) && (
                <motion.div key='results' initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className='flex-1 flex flex-col'>
                    <div className='mt-auto space-y-3'>
                        {currentCardIndex < shuffledCards.length - 1 ? (
                            <Button onClick={nextQuestion} variant='onca' size='lg' className='w-full'>
                                Próxima Pergunta
                                <ChevronRight className='w-5 h-5 ml-2' />
                            </Button>
                        ) : (
                            <p className='text-center text-muted-foreground mb-2'>Fim das perguntas!</p>
                        )}
                        <Button onClick={resetGame} variant='outline' size='lg' className='w-full'>
                            <RotateCcw className='w-4 h-4 mr-2' />
                            Novo Jogo
                        </Button>
                    </div>
                </motion.div>
            )}
        </Game.Container>
    );
}

export default Onca;
