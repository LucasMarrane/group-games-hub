import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Check, X, RotateCcw, Users, Timer } from 'lucide-react';
import { Button } from '@shadcn/components/ui/button';
import { Input } from '@shadcn/components/ui/input';
import { MimicaGame } from '@/data/index';
import { MimicaCard, MimicaCategory, Team } from '@appTypes/mimica';
import * as Games from '@components/game';

const categoryInfo: Record<MimicaCategory, { name: string; color: string; icon: string }> = {
    P: { name: 'Pessoa/Animal/Lugar', color: 'bg-blue-500', icon: '👤' },
    O: { name: 'Objeto', color: 'bg-green-500', icon: '📦' },
    A: { name: 'Ação/Verbo', color: 'bg-yellow-500', icon: '🏃' },
    D: { name: 'Difícil', color: 'bg-red-500', icon: '🔥' },
    L: { name: 'Lazer', color: 'bg-purple-500', icon: '🎮' },
    M: { name: 'Mix', color: 'bg-pink-500', icon: '🎲' },
};

const defaultTeams: Team[] = [
    { name: 'Time 1', score: 0, color: 'hsl(160 70% 45%)' },
    { name: 'Time 2', score: 0, color: 'hsl(280 75% 60%)' },
];

type GamePhase = 'setup' | 'playing' | 'results';

export function Mimica() {
    const [phase, setPhase] = useState<GamePhase>('setup');
    const [teams, setTeams] = useState<Team[]>(defaultTeams);
    const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
    const [timerDuration, setTimerDuration] = useState(60);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [currentCard, setCurrentCard] = useState<MimicaCard | null>(null);
    const [usedCardIds, setUsedCardIds] = useState<Set<number>>(new Set());

    const cards = MimicaGame.themes.flatMap((i) => i.items.map((c) => ({ id: c.id, word: c.title, category: c.category, points: c.value }))) as MimicaCard[];

    const drawCard = useCallback(() => {
        const availableCards = cards.filter((c) => !usedCardIds.has(c.id));
        if (availableCards.length === 0) {
            setUsedCardIds(new Set());
            return;
        }
        const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
        setCurrentCard(randomCard);
        setUsedCardIds((prev) => new Set([...prev, randomCard.id]));
    }, [cards, usedCardIds]);

    const handleCorrect = useCallback(() => {
        if (currentCard) {
            setTeams((prev) => prev.map((team, idx) => (idx === currentTeamIndex ? { ...team, score: team.score + currentCard.points } : team)));
        }
        drawCard();
    }, [currentCard, currentTeamIndex, drawCard]);

    const handleWrong = useCallback(() => {
        drawCard();
    }, [drawCard]);

    const startGame = useCallback(() => {
        if (teams.every((t) => t.name.trim())) {
            setPhase('playing');
            setTimeLeft(timerDuration);
            drawCard();
        }
    }, [teams, timerDuration, drawCard]);

    const toggleTimer = useCallback(() => {
        setIsTimerRunning((prev) => !prev);
    }, []);

    const resetRound = useCallback(() => {
        setTimeLeft(timerDuration);
        setIsTimerRunning(false);
        setCurrentCard(null);
    }, [timerDuration]);

    const nextTeam = useCallback(() => {
        setCurrentTeamIndex((prev) => (prev + 1) % teams.length);
        resetRound();
        drawCard();
    }, [teams.length, resetRound, drawCard]);

    const resetGame = useCallback(() => {
        setPhase('setup');
        setTeams(defaultTeams);
        setCurrentTeamIndex(0);
        setTimeLeft(timerDuration);
        setIsTimerRunning(false);
        setCurrentCard(null);
        setUsedCardIds(new Set());
    }, [timerDuration]);

    useEffect(() => {
        let interval: any;
        if (isTimerRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsTimerRunning(false);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timeLeft]);

    const currentTeam = teams[currentTeamIndex];
    const catInfo = currentCard ? categoryInfo[currentCard.category] : null;

    return (
        <Games.Container game={MimicaGame} className='text-gradient-mimica'>
            {/* Scoreboard */}
            <div className='flex gap-2'>
                {teams.map((team, idx) => (
                    <motion.div
                        key={idx}
                        layout
                        className={`flex-1 p-3 rounded-xl border transition-all ${phase === 'playing' && idx === currentTeamIndex ? 'border-secondary shadow-glow-mimica' : 'border-border'}`}
                        style={{
                            background: phase === 'playing' && idx === currentTeamIndex ? `${team.color}20` : undefined,
                        }}
                    >
                        <div className='text-center'>
                            <div className='text-xs text-muted-foreground mb-1'>{team.name}</div>
                            <div className='text-2xl font-display font-bold' style={{ color: team.color }}>
                                {team.score}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence mode='wait'>
                {phase === 'setup' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className='flex-1 space-y-4'>
                        <div className='bg-card rounded-2xl p-6 border border-border space-y-4'>
                            <div className='flex items-center gap-2 text-muted-foreground mb-4'>
                                <Users className='w-5 h-5' />
                                <span className='font-medium'>Configurar Times</span>
                            </div>

                            {teams.map((team, idx) => (
                                <Input
                                    key={idx}
                                    placeholder={`Nome do Time ${idx + 1}`}
                                    value={team.name}
                                    onChange={(e) => setTeams((prev) => prev.map((t, i) => (i === idx ? { ...t, name: e.target.value } : t)))}
                                    className='bg-muted border-border'
                                />
                            ))}

                            <div className='flex items-center gap-2 text-muted-foreground pt-4 border-t border-border'>
                                <Timer className='w-5 h-5' />
                                <span className='font-medium'>Tempo por Rodada</span>
                            </div>

                            <div className='flex gap-2'>
                                {[30, 45, 60, 90].map((time) => (
                                    <Button
                                        key={time}
                                        variant={timerDuration === time ? 'mimica' : 'glass'}
                                        size='sm'
                                        onClick={() => {
                                            setTimerDuration(time);
                                            setTimeLeft(time);
                                        }}
                                        className='flex-1'
                                    >
                                        {time}s
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <Button variant='mimica' size='xl' className='w-full' onClick={startGame}>
                            <Play className='w-5 h-5' />
                            Começar Jogo
                        </Button>
                    </motion.div>
                )}

                {phase === 'playing' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className='flex-1 flex flex-col gap-4'>
                        {/* Timer */}
                        <div className='bg-card rounded-2xl p-4 border border-border'>
                            <div className='flex items-center justify-between'>
                                <span className='text-sm text-muted-foreground'>
                                    Vez de:{' '}
                                    <span className='font-bold' style={{ color: currentTeam.color }}>
                                        {currentTeam.name}
                                    </span>
                                </span>
                                <div className='flex items-center gap-2'>
                                    <motion.span
                                        key={timeLeft}
                                        initial={{ scale: 1.2 }}
                                        animate={{ scale: 1 }}
                                        className={`text-3xl font-display font-bold ${timeLeft <= 10 ? 'text-destructive' : 'text-foreground'}`}
                                    >
                                        {timeLeft}s
                                    </motion.span>
                                    <Button variant='glass' size='icon' onClick={toggleTimer} disabled={timeLeft === 0}>
                                        {isTimerRunning ? <Pause className='w-5 h-5' /> : <Play className='w-5 h-5' />}
                                    </Button>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className='mt-3 h-2 rounded-full bg-muted overflow-hidden'>
                                <motion.div className='h-full gradient-mimica' initial={{ width: '100%' }} animate={{ width: `${(timeLeft / timerDuration) * 100}%` }} transition={{ duration: 0.3 }} />
                            </div>
                        </div>

                        {/* Card */}
                        <AnimatePresence mode='wait'>
                            {currentCard && (
                                <motion.div
                                    key={currentCard.id}
                                    initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
                                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                                    exit={{ scale: 0.8, opacity: 0, rotateY: -90 }}
                                    className='flex-1 bg-card rounded-2xl p-6 border border-border flex flex-col items-center justify-center gap-4'
                                >
                                    {catInfo && (
                                        <div className={`px-4 py-2 rounded-full ${catInfo.color} text-white text-sm font-medium flex items-center gap-2`}>
                                            <span>{catInfo.icon}</span>
                                            <span>{catInfo.name}</span>
                                        </div>
                                    )}

                                    <h2 className='text-4xl font-display font-bold text-center text-foreground'>{currentCard.word}</h2>

                                    <div className='flex items-center gap-2 text-secondary'>
                                        <span className='text-2xl font-bold'>+{currentCard.points}</span>
                                        <span className='text-sm text-muted-foreground'>pontos</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Action buttons */}
                        <div className='flex gap-3'>
                            <Button variant='destructive' size='xl' className='flex-1' onClick={handleWrong}>
                                <X className='w-6 h-6' />
                                Passou
                            </Button>
                            <Button variant='mimica' size='xl' className='flex-1' onClick={handleCorrect}>
                                <Check className='w-6 h-6' />
                                Acertou!
                            </Button>
                        </div>

                        {/* Control buttons */}
                        <div className='flex gap-2'>
                            <Button variant='glass' className='flex-1' onClick={nextTeam}>
                                <Users className='w-4 h-4' />
                                Próximo Time
                            </Button>
                            <Button variant='glass' className='flex-1' onClick={resetGame}>
                                <RotateCcw className='w-4 h-4' />
                                Reiniciar
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Games.Container>
    );
}

export default Mimica;
