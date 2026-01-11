import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ChevronRight, RotateCcw, Bird, Send } from 'lucide-react';
import { AdaptedPalpiteiroTheme } from '@appTypes/palpiteiro';
import { Button } from '@shadcn/components/ui/button';
import { PalpiteiroGame } from '@/data/index';
import * as Game from '@components/game';
import { Icon } from '@components/game/game.icon';
import { useMultiplayer } from '@/hooks/useMultiplayer';
import { Input } from '@shadcn/components/ui/input';
import { toast } from 'sonner';

export function Palpiteiro() {
    const [guess, setGuess] = useState(0);
    const { isHost, startGame, localPlayerId, gameState, changeGame: changeGameState, players: playersRoom } = useMultiplayer<any>();

    const { showAnswer = false, shuffledCards = [], currentCardIndex = 0, players = [], minValue = 0, lastPlayer, actualPlayer } = gameState ?? {};

    const cards = PalpiteiroGame.themes.flatMap((i) =>
        i.items.map((c) => ({ ...c, theme: c.title, value: c.value, answer: c.answer, category: i.categories.find((ca) => ca.id == c.category)?.name } as AdaptedPalpiteiroTheme)),
    );

    const currentTheme = shuffledCards[currentCardIndex];

    function shuffle() {
        const shuffled = [...cards].sort(() => Math.random() - 0.5);
        return shuffled;
    }

    const starNewGame = useCallback(() => {
        if (!isHost) return;
        if (players.every((p: any) => p.name.trim())) {
            startGame('playing');
            setDesk();
        }
    }, [players]);

    function setDesk(action: string = 'shuffle') {
        const actions: Record<string, Function> = {
            shuffle: () => {
                const shuffled = shuffle();
                changeGameState({
                    ...gameState,
                    phase: 'playing',
                    showAnswer: false,
                    currentCardIndex: 0,
                    shuffledCards: shuffled,
                    players: playersRoom.map((p) => ({ ...p, value: 0, connection: null })),
                    actualPlayer: localPlayerId,
                    minValue: 0,
                });
            },
            addValue: () => {
                const value = currentTheme.value;
                changeGameState({ ...gameState, players: gameState.players.map((p: any) => ({ ...p, value: Math.max(0, p.ducks + value) })) });
            },
            removeValue: () => {
                const value = currentTheme.value;
                changeGameState({ ...gameState, players: gameState.players.map((p: any) => ({ ...p, value: Math.max(0, p.ducks - value) })) });
            },
            nextQuestion: () => {
                const index = currentCardIndex >= cards.length - 1 ? 0 : currentCardIndex + 1;
                changeGameState({ ...gameState, currentCardIndex: index, showAnswer: false });
            },
            showAnswer: () => {
                const loser = currentTheme.answer <= minValue ? localPlayerId : lastPlayer;
                const _players = gameState.players.map((p: any) => {
                    let result = { ...p };

                    if (p.id == loser) {
                        result.value = p.value + currentTheme.value;
                    }
                    return result;
                });
                changeGameState({ ...gameState, showAnswer: true, players: _players, minValue: 0 });
            },
            guess: () => {
                const indexPlayer = gameState.players.findIndex((i: any) => i.id == localPlayerId);
                const nextId = indexPlayer >= gameState.players.length - 1 ? 0 : indexPlayer + 1;
                changeGameState({ ...gameState, minValue: guess, lastPlayer: localPlayerId, actualPlayer: gameState.players[nextId].id });
            },
        };

        actions?.[action]?.();
    }

    function toggleAnswer() {
        setDesk('showAnswer');
    }

    function makeGuess() {
        if (guess <= minValue) {
            toast.warning('Apenas valor maior que o valor anterior é permitido');
            return;
        }
        setDesk('guess');
    }

    const nextQuestion = useCallback(() => {
        setDesk('nextQuestion');
    }, [currentCardIndex, shuffledCards]);

    const resetGame = useCallback(() => {
        starNewGame();
    }, []);

    useEffect(() => {
        setGuess(minValue);
    }, [minValue]);

    const sortedPlayers = useMemo(() => [...players].sort((a, b) => a.ducks - b.ducks), [players]);

    return (
        <Game.Container game={PalpiteiroGame} className='text-gradient-palpiteiro' icon={<Icon variant='palpiteiro' />}>
            <AnimatePresence mode='wait'>
                {!gameState?.phase && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className='flex-1 space-y-4'>
                        <Game.Multiplayer variant='palpiteiro' />

                        <Button variant='palpiteiro' size='xl' className='w-full' onClick={starNewGame} disabled={!isHost}>
                            <Bird className='w-5 h-5' />
                            Começar Jogo
                        </Button>
                    </motion.div>
                )}

                {gameState?.phase === 'playing' && currentTheme && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className='flex-1 flex flex-col gap-4'>
                        {/* Scoreboard */}
                        <div className='flex gap-2 overflow-x-auto pb-2'>
                            {sortedPlayers.map((player, idx) => (
                                <motion.div
                                    key={player.id}
                                    layout
                                    className={`flex-shrink-0 min-w-[100px] p-3 rounded-xl border ${idx === 0 ? 'border-secondary bg-secondary/10' : 'border-border bg-card'}`}
                                >
                                    <div className='text-center'>
                                        <div className='text-xs text-muted-foreground truncate'>{player.name}</div>
                                        <div className='flex items-center justify-center gap-1'>
                                            <Bird className='w-4 h-4 text-palpiteiro' />
                                            <span className='text-xl font-display font-bold text-foreground'>{player.value}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Current Card */}
                        <motion.div
                            key={`palpiteiro-${currentCardIndex}`}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className='bg-card rounded-2xl border border-border overflow-hidden'
                        >
                            {/* Theme Header */}
                            <div className='gradient-palpiteiro p-4'>
                                <div className='flex items-center justify-between'>
                                    <h3 className='text-lg font-display font-bold text-white'>{currentTheme.category}</h3>
                                    <div className='flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full'>
                                        <Bird className='w-4 h-4 text-white' />
                                        <span className='text-white font-bold'>{currentTheme.value}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Question */}
                            <div className='p-6'>
                                <p className='text-xl font-display text-foreground text-center mb-6'>{currentTheme.theme}</p>
                                {/* Answer Section */}
                                <div className='bg-muted rounded-xl p-4'>
                                    <AnimatePresence mode='wait'>
                                        {showAnswer ? (
                                            <motion.div key='answer' initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className='text-center'>
                                                <span className='text-5xl font-display font-bold text-gradient-palpiteiro'>{currentTheme.answer}</span>
                                            </motion.div>
                                        ) : (
                                            <motion.div key='hidden' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className=' flex text-center justify-around'>
                                                <div className='flex justify-center align-center'>
                                                    <Input
                                                        placeholder='Valor'
                                                        type='number'
                                                        value={guess}
                                                        min={minValue + 1}
                                                        disabled={localPlayerId != actualPlayer}
                                                        onChange={(e) => {
                                                            const value = e?.target?.value ?? '0';
                                                            if (!value) {
                                                                setGuess(e?.target?.value as any);
                                                                return;
                                                            }
                                                            if (/^\d+$/.test(value)) {
                                                                setGuess(Number(value));
                                                            }
                                                        }}
                                                        className='text-center'
                                                    />
                                                    <Button variant='palpiteiro' size='default' onClick={makeGuess} className='gap-2 ml-5' disabled={localPlayerId != actualPlayer}>
                                                        <Send className='w-5 h-5' />
                                                        Responder
                                                    </Button>
                                                </div>

                                                <Button variant='palpiteiro' size='lg' onClick={() => toggleAnswer()} className='gap-2' disabled={localPlayerId != actualPlayer}>
                                                    <Eye className='w-5 h-5' />
                                                    EU DUVIDO .....
                                                </Button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>

                        <div className='flex gap-2'>
                            <Button variant='glass' className='flex-1' disabled={!isHost} onClick={resetGame}>
                                <RotateCcw className='w-4 h-4' />
                                Reiniciar
                            </Button>
                            <Button variant='palpiteiro' className='flex-1' onClick={nextQuestion}>
                                <ChevronRight className='w-4 h-4' />
                                Próxima
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Game.Container>
    );
}

export default Palpiteiro;
