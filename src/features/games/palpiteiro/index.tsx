import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ChevronRight, RotateCcw, Bird, Send, Minus, Plus, Flag } from 'lucide-react';
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
    const { isHost, startGame, localPlayerId, gameState, changeGame: changeGameState, mode, setPlayers, players } = useMultiplayer<any>();

    const { showAnswer = false, shuffledCards = [], currentCardIndex = 0, minValue = 0, lastPlayer, actualPlayer } = gameState ?? {};

    const cards = PalpiteiroGame.themes.flatMap((i) =>
        i.items.map((c) => ({ ...c, theme: c.title, value: c.value, answer: c.answer, category: i.categories.find((ca) => ca.id == c.category)?.name }) as AdaptedPalpiteiroTheme),
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

    const userRef = useRef(localPlayerId);

    function setDesk(action: string = 'shuffle') {
        const actions: Record<string, Function> = {
            shuffle: () => {
                const shuffled = shuffle();
                setPlayers(players.map((p) => ({ ...p, points: 0 })));
                changeGameState({
                    ...gameState,
                    phase: 'playing',
                    showAnswer: false,
                    currentCardIndex: 0,
                    shuffledCards: shuffled,
                    actualPlayer: localPlayerId,
                    minValue: 0,
                });
            },
            addValue: () => {
                const _players = players.map((p) => {
                    let result = { ...p };

                    if (p.id == userRef.current) {
                        result.points = p.points + currentTheme.value;
                    }
                    return result;
                });
                setPlayers(_players);
            },
            removeValue: () => {
                const _players = players.map((p) => {
                    let result = { ...p };

                    if (p.id == userRef.current) {
                        result.points = p.points! - currentTheme.value;
                    }
                    return result;
                });
                setPlayers(_players);
            },
            nextQuestion: () => {
                const index = currentCardIndex >= cards.length - 1 ? 0 : currentCardIndex + 1;                
                changeGameState({ ...gameState, currentCardIndex: index, showAnswer: false });
            },
            showAnswer: () => {
                let _players = players;
                if (!['single', 'local'].includes(mode)) {
                    const loser = minValue > currentTheme.answer ? lastPlayer : localPlayerId;
                    _players = players.map((p) => {
                        let result = { ...p };

                        if (p.id == loser) {
                            result.points = p.points + currentTheme.value;
                        }
                        return result;
                    });
                }
                setPlayers(_players);
                changeGameState({ ...gameState, showAnswer: true, minValue: 0 });
            },
            guess: () => {
                const indexPlayer = players.findIndex((i: any) => i.id == localPlayerId);
                const nextId = indexPlayer >= players.length - 1 ? 0 : indexPlayer + 1;
                changeGameState({ ...gameState, minValue: guess, lastPlayer: localPlayerId, actualPlayer: players[nextId].id });
            },
            finish: () => {
                changeGameState({ ...gameState, phase: 'finished' });
            },
        };

        actions?.[action]?.();
    }
    function addValue() {
        setDesk('addValue');
    }

    function removeValue() {
        setDesk('removeValue');
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

    const nextQuestion = () => {
        setDesk('nextQuestion');
    };

    const resetGame = () => {
        starNewGame();
    };

    const finish = () => {
        setDesk('finish');
    };

    useEffect(() => {
        setGuess(minValue);
    }, [minValue]);

    return (
        <Game.Container game={PalpiteiroGame} className='text-gradient-palpiteiro' icon={<Icon variant='palpiteiro' />} onStart={starNewGame} showMultiplayer>
            {gameState?.phase === 'playing' && currentTheme && (
                <motion.div key='counter' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className='flex-1 flex flex-col gap-4'>
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
                                        <motion.div
                                            key='hidden'
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className=' flex text-center justify-around md:flex-row flex-col'
                                        >
                                            {mode == 'online' ? (
                                                <>
                                                    <div className='flex justify-center align-center mb-2 sm:mb-0'>
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
                                                    <div>
                                                        <Button variant='palpiteiro' size='lg' onClick={() => toggleAnswer()} className='gap-2' disabled={localPlayerId != actualPlayer || !guess}>
                                                            <Eye className='w-5 h-5' />
                                                            EU DUVIDO .....
                                                        </Button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <Button variant='palpiteiro' size='lg' onClick={toggleAnswer} className='gap-2'>
                                                        <Eye className='w-5 h-5' />
                                                        Revelar Resposta
                                                    </Button>
                                                </>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>

                    {mode == 'local' && showAnswer && (
                        <>
                            <motion.div key='local-values' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='bg-card rounded-2xl p-4 border border-border'>
                                <h4 className='text-sm text-muted-foreground mb-3 flex items-center gap-2'>
                                    <Bird className='w-4 h-4' />
                                    Distribuir pontuação
                                </h4>
                                <div className='space-y-2'>
                                    {players.map((player, idx: number) => (
                                        <div key={`pontuacao-${player.id ?? idx}`} className='flex items-center justify-between bg-muted rounded-lg p-2'>
                                            <span className='text-sm font-medium'>{player.name}</span>
                                            <div className='flex items-center gap-2'>
                                                <Button
                                                    variant='ghost'
                                                    size='icon'
                                                    onClick={() => {
                                                        userRef.current = player.id;
                                                        removeValue();
                                                    }}
                                                    className='h-8 w-8'
                                                >
                                                    <Minus className='w-4 h-4' />
                                                </Button>
                                                <span className='w-8 text-center font-bold'>{player.points}</span>
                                                <Button
                                                    variant='palpiteiro'
                                                    size='icon'
                                                    onClick={() => {
                                                        userRef.current = player.id;
                                                        addValue();
                                                    }}
                                                    className='h-8 w-8'
                                                >
                                                    <Plus className='w-4 h-4' />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </>
                    )}
                </motion.div>
            )}

            {['playing', 'finished'].includes(gameState?.phase) && (
                <div className='flex gap-2'>
                    <Button variant='glass' className='flex-1' disabled={!isHost} onClick={resetGame}>
                        <RotateCcw className='w-4 h-4' />
                        Reiniciar
                    </Button>
                    {gameState?.phase != 'finished' && (
                        <>
                            <Button variant='destructive' className='flex-1' onClick={finish} disabled={!isHost}>
                                <Flag className='w-4 h-4' />
                                Finalizar
                            </Button>
                            <Button variant='palpiteiro' className='flex-1' onClick={nextQuestion} disabled={actualPlayer != localPlayerId}>
                                <ChevronRight className='w-4 h-4' />
                                Próxima
                            </Button>
                        </>
                    )}
                </div>
            )}
        </Game.Container>
    );
}

export default Palpiteiro;
