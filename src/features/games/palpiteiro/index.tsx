import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ChevronRight, Plus, Minus, Users, RotateCcw, Bird } from 'lucide-react';
import { AdaptedPalpiteiroTheme, PalpiteiroPlayer } from '@appTypes/palpiteiro';
import { Button } from '@shadcn/components/ui/button';
import { Input } from '@shadcn/components/ui/input';
import { PalpiteiroGame } from '@/data/index';
import * as Games from '@components/game';

type GamePhase = 'setup' | 'playing';

export function Palpiteiro() {
    const [phase, setPhase] = useState<GamePhase>('setup');
    const [players, setPlayers] = useState<PalpiteiroPlayer[]>([
        { id: '1', name: 'Jogador 1', ducks: 0 },
        { id: '2', name: 'Jogador 2', ducks: 0 },
    ]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [shuffledCards, setShuffledCards] = useState<AdaptedPalpiteiroTheme[]>([]);

    const cards = PalpiteiroGame.themes.flatMap((i) =>
        i.items.map((c) => ({ ...c, theme: c.title, value: c.value, answer: c.answer, category: i.categories.find((ca) => ca.id == c.category)?.name } as AdaptedPalpiteiroTheme)),
    );

    const shuffleCards = useCallback(() => {
        const shuffled = [...cards].sort(() => Math.random() - 0.5);
        setShuffledCards(shuffled);
        setCurrentCardIndex(0);
        setCurrentQuestionIndex(0);
        setShowAnswer(false);
    }, [cards]);

    const startGame = useCallback(() => {
        if (players.every((p) => p.name.trim())) {
            shuffleCards();
            setPhase('playing');
        }
    }, [players, shuffleCards]);

    const addPlayer = useCallback(() => {
        const newId = String(Date.now());
        setPlayers((prev) => [...prev, { id: newId, name: `Jogador ${prev.length + 1}`, ducks: 0 }]);
    }, []);

    const removePlayer = useCallback((id: string) => {
        setPlayers((prev) => (prev.length > 2 ? prev.filter((p) => p.id !== id) : prev));
    }, []);

    const updatePlayerName = useCallback((id: string, name: string) => {
        setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
    }, []);

    const addDucks = useCallback((id: string, amount: number) => {
        setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, ducks: Math.max(0, p.ducks + amount) } : p)));
    }, []);

    const nextQuestion = useCallback(() => {
        const currentCard = shuffledCards[currentCardIndex];
        if (currentQuestionIndex < currentCard.theme.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else if (currentCardIndex < shuffledCards.length - 1) {
            setCurrentCardIndex((prev) => prev + 1);
            setCurrentQuestionIndex(0);
        } else {
            shuffleCards();
        }
        setShowAnswer(false);
    }, [currentCardIndex, currentQuestionIndex, shuffledCards, shuffleCards]);

    const resetGame = useCallback(() => {
        setPhase('setup');
        setPlayers((prev) => prev.map((p) => ({ ...p, ducks: 0 })));
        setCurrentCardIndex(0);
        setCurrentQuestionIndex(0);
        setShowAnswer(false);
    }, []);

    const currentTheme = shuffledCards[currentCardIndex];

    const sortedPlayers = useMemo(() => [...players].sort((a, b) => a.ducks - b.ducks), [players]);

    return (
        <Games.Container game={PalpiteiroGame} className='text-gradient-palpiteiro'>
            <AnimatePresence mode='wait'>
                {phase === 'setup' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className='flex-1 space-y-4'>
                        <div className='bg-card rounded-2xl p-6 border border-border space-y-4'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2 text-muted-foreground'>
                                    <Users className='w-5 h-5' />
                                    <span className='font-medium'>Jogadores</span>
                                </div>
                                <Button variant='glass' size='sm' onClick={addPlayer}>
                                    <Plus className='w-4 h-4' />
                                    Adicionar
                                </Button>
                            </div>

                            {players.map((player, idx) => (
                                <div key={player.id} className='flex items-center gap-2'>
                                    <Input
                                        placeholder={`Jogador ${idx + 1}`}
                                        value={player.name}
                                        onChange={(e) => updatePlayerName(player.id, e.target.value)}
                                        className='bg-muted border-border flex-1'
                                    />
                                    {players.length > 2 && (
                                        <Button variant='ghost' size='icon' onClick={() => removePlayer(player.id)} className='text-destructive'>
                                            <Minus className='w-4 h-4' />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <Button variant='palpiteiro' size='xl' className='w-full' onClick={startGame}>
                            <Bird className='w-5 h-5' />
                            Começar Jogo
                        </Button>
                    </motion.div>
                )}

                {phase === 'playing' && currentTheme && (
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
                                            <span className='text-xl font-display font-bold text-foreground'>{player.ducks}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Current Card */}
                        <motion.div
                            key={`${currentCardIndex}-${currentQuestionIndex}`}
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
                                            <motion.div key='hidden' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='text-center'>
                                                <Button variant='palpiteiro' size='lg' onClick={() => setShowAnswer(true)} className='gap-2'>
                                                    <Eye className='w-5 h-5' />
                                                    Revelar Resposta
                                                </Button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>

                        {/* Duck Assignment */}
                        {showAnswer && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='bg-card rounded-2xl p-4 border border-border'>
                                <h4 className='text-sm text-muted-foreground mb-3 flex items-center gap-2'>
                                    <Bird className='w-4 h-4' />
                                    Distribuir pontuação
                                </h4>
                                <div className='space-y-2'>
                                    {players.map((player) => (
                                        <div key={player.id} className='flex items-center justify-between bg-muted rounded-lg p-2'>
                                            <span className='text-sm font-medium'>{player.name}</span>
                                            <div className='flex items-center gap-2'>
                                                <Button variant='ghost' size='icon' onClick={() => addDucks(player.id, -1)} disabled={player.ducks === 0} className='h-8 w-8'>
                                                    <Minus className='w-4 h-4' />
                                                </Button>
                                                <span className='w-8 text-center font-bold'>{player.ducks}</span>
                                                <Button variant='palpiteiro' size='icon' onClick={() => addDucks(player.id, currentTheme.value)} className='h-8 w-8'>
                                                    <Plus className='w-4 h-4' />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Navigation */}
                        <div className='flex gap-2'>
                            <Button variant='glass' className='flex-1' onClick={resetGame}>
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
        </Games.Container>
    );
}

export default Palpiteiro;
