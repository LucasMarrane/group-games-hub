import { CaotiqueiraPlayer } from '@appTypes/caotiqueira';
import * as Game from '@components/game';
import { Icon } from '@components/game/game.icon';
import { CaotiqueiraGame } from '@data/caotiqueira/theme';
import { Button } from '@shadcn/components/ui/button';
import { Input } from '@shadcn/components/ui/input';
import { motion } from 'framer-motion';
import { Crown, Minus, Play, Plus, RotateCcw, Shuffle, Timer, Trophy, Users, Vote } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

type GamePhase = 'setup' | 'writing' | 'reveal' | 'voting' | 'results' | 'scoreboard';

export function Caotiqueira() {
    const [phase, setPhase] = useState<GamePhase>('setup');
    const [players, setPlayers] = useState<CaotiqueiraPlayer[]>([]);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [timerDuration, setTimerDuration] = useState(60);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [currentTheme, setCurrentTheme] = useState<string>('');
    const [usedThemes, setUsedThemes] = useState<number[]>([]);
    const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
    const [roundNumber, setRoundNumber] = useState(1);

    const addPlayer = () => {
        if (newPlayerName.trim() && players.length < 10) {
            setPlayers([...players, { id: Date.now().toString(), name: newPlayerName.trim(), score: 0 }]);
            setNewPlayerName('');
        }
    };

    const removePlayer = (id: string) => {
        setPlayers(players.filter((p) => p.id !== id));
    };

    const startWritingPhase = () => {
        setTimeLeft(timerDuration);
        setIsTimerRunning(true);
        setPhase('writing');
    };

    const themesData = CaotiqueiraGame.themes.flatMap((i) => i.items);
    const drawTheme = useCallback(() => {
        const availableThemes = themesData.filter((t) => !usedThemes.includes(t.id));

        if (availableThemes.length === 0) {
            setUsedThemes([]);
            const randomTheme = themesData[Math.floor(Math.random() * themesData.length)];
            setCurrentTheme(randomTheme.title);
            setUsedThemes([randomTheme.id]);
        } else {
            const randomTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
            setCurrentTheme(randomTheme.title);
            setUsedThemes([...usedThemes, randomTheme.id]);
        }
    }, [usedThemes]);

    useEffect(() => {
        let interval: any;
        if (isTimerRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isTimerRunning) {
            setIsTimerRunning(false);
            drawTheme();
            setPhase('reveal');
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timeLeft, drawTheme]);

    const goToVoting = () => {
        setPhase('voting');
    };

    const selectWinner = (playerId: string) => {
        setSelectedWinner(playerId);
    };

    const confirmWinner = () => {
        if (selectedWinner) {
            setPlayers(players.map((p) => (p.id === selectedWinner ? { ...p, score: p.score + 1 } : p)));
            setPhase('results');
        }
    };

    const nextRound = () => {
        setRoundNumber(roundNumber + 1);
        setSelectedWinner(null);
        setCurrentTheme('');
        startWritingPhase();
    };

    const showScoreboard = () => {
        setPhase('scoreboard');
    };

    const resetGame = () => {
        setPhase('setup');
        setPlayers(players.map((p) => ({ ...p, score: 0 })));
        setUsedThemes([]);
        setRoundNumber(1);
        setSelectedWinner(null);
        setCurrentTheme('');
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const winner = selectedWinner ? players.find((p) => p.id === selectedWinner) : null;

    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    return (
        <Game.Container className='text-gradient-caotiqueira' game={CaotiqueiraGame} icon={<Icon variant='caotiqueira' />}>
            <div className='flex flex-col items-center justify-center p-4'>
                {phase === 'setup' && (
                    <>
                        {/* Setup Phase */}

                        <motion.div key='setup' initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className='w-full max-w-md space-y-6'>
                            {/* Timer Duration */}
                            <div className='glass-card p-4 rounded-xl'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-2'>
                                        <Timer className='w-5 h-5 text-caotiqueira' />
                                        <span className='font-medium'>Tempo para escrever</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Button variant='outline' size='icon' onClick={() => setTimerDuration(Math.max(30, timerDuration - 15))} className='h-8 w-8'>
                                            <Minus className='w-4 h-4' />
                                        </Button>
                                        <span className='w-12 text-center font-bold'>{timerDuration}s</span>
                                        <Button variant='outline' size='icon' onClick={() => setTimerDuration(Math.min(180, timerDuration + 15))} className='h-8 w-8'>
                                            <Plus className='w-4 h-4' />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Add Players */}
                            <div className='glass-card p-4 rounded-xl space-y-3'>
                                <div className='flex items-center gap-2 mb-2'>
                                    <Users className='w-5 h-5 text-caotiqueira' />
                                    <span className='font-medium'>Jogadores ({players.length}/10)</span>
                                </div>
                                <div className='flex gap-2'>
                                    <Input
                                        value={newPlayerName}
                                        onChange={(e) => setNewPlayerName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                                        placeholder='Nome do jogador'
                                        className='flex-1'
                                        maxLength={15}
                                    />
                                    <Button onClick={addPlayer} variant='caotiqueira' size='icon'>
                                        <Plus className='w-5 h-5' />
                                    </Button>
                                </div>

                                {/* Player List */}
                                <div className='space-y-2 max-h-40 overflow-y-auto'>
                                    {players.map((player, index) => (
                                        <motion.div
                                            key={player.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className='flex items-center justify-between p-2 rounded-lg bg-caotiqueira/10'
                                        >
                                            <span className='flex items-center gap-2'>
                                                <span className='w-6 h-6 rounded-full bg-caotiqueira text-white text-xs flex items-center justify-center font-bold'>{index + 1}</span>
                                                {player.name}
                                            </span>
                                            <Button variant='ghost' size='sm' onClick={() => removePlayer(player.id)} className='text-destructive hover:text-destructive'>
                                                ✕
                                            </Button>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <Button onClick={startWritingPhase} variant='caotiqueira' size='lg' className='w-full' disabled={players.length < 2}>
                                <Play className='w-5 h-5 mr-2' />
                                Começar Jogo
                            </Button>
                        </motion.div>
                    </>
                )}

                {/* Writing Phase */}
                {phase === 'writing' && (
                    <motion.div
                        key='writing'
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className='w-full max-w-md text-center space-y-6'
                    >
                        <div className='glass-card p-6 rounded-2xl'>
                            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1, repeat: Infinity }} className='text-6xl font-display font-bold text-caotiqueira mb-4'>
                                {formatTime(timeLeft)}
                            </motion.div>
                            <p className='text-xl font-medium text-foreground mb-2'>✍️ Escrevam suas respostas!</p>
                            <p className='text-muted-foreground'>Anotem uma palavra ou frase bizarra (ou não) no papel</p>
                        </div>

                        <div className='glass-card p-4 rounded-xl bg-caotiqueira/10'>
                            <p className='text-sm text-muted-foreground'>
                                Rodada {roundNumber} • {players.length} jogadores
                            </p>
                        </div>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className='text-muted-foreground text-sm'>
                            O tema será revelado quando o tempo acabar!
                        </motion.div>
                    </motion.div>
                )}

                {/* Reveal Phase */}
                {phase === 'reveal' && (
                    <motion.div
                        key='reveal'
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className='w-full max-w-md text-center space-y-6'
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                            className='w-16 h-16 mx-auto rounded-full gradient-caotiqueira shadow-glow-caotiqueira flex items-center justify-center'
                        >
                            <Shuffle className='w-8 h-8 text-white' />
                        </motion.div>

                        <h2 className='text-xl font-display font-bold text-foreground'>Tema Sorteado!</h2>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className='glass-card p-6 rounded-2xl'>
                            <p className='text-2xl font-display font-bold text-caotiqueira leading-relaxed'>"{currentTheme}"</p>
                        </motion.div>

                        <p className='text-muted-foreground'>Cada jogador deve revelar sua resposta e encaixá-la na lacuna!</p>

                        <Button onClick={goToVoting} variant='caotiqueira' size='lg' className='w-full'>
                            <Vote className='w-5 h-5 mr-2' />
                            Ir para Votação
                        </Button>
                    </motion.div>
                )}

                {/* Voting Phase */}
                {phase === 'voting' && (
                    <motion.div key='voting' initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className='w-full max-w-md space-y-6'>
                        <div className='text-center'>
                            <Vote className='w-12 h-12 mx-auto text-caotiqueira mb-3' />
                            <h2 className='text-2xl font-display font-bold text-foreground'>Votação</h2>
                            <p className='text-muted-foreground mt-2'>Quem teve a melhor resposta?</p>
                        </div>

                        <div className='glass-card p-4 rounded-xl mb-4'>
                            <p className='text-sm text-muted-foreground mb-1'>Tema:</p>
                            <p className='text-lg font-medium text-caotiqueira'>"{currentTheme}"</p>
                        </div>

                        <div className='space-y-3'>
                            {players.map((player) => (
                                <motion.button
                                    key={player.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => selectWinner(player.id)}
                                    className={`w-full p-4 rounded-xl text-left transition-all ${
                                        selectedWinner === player.id ? 'gradient-caotiqueira text-white shadow-glow-caotiqueira' : 'glass-card hover:bg-caotiqueira/10'
                                    }`}
                                >
                                    <div className='flex items-center gap-3'>
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                                selectedWinner === player.id ? 'bg-white/20 text-white' : 'bg-caotiqueira/20 text-caotiqueira'
                                            }`}
                                        >
                                            {player.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className='font-medium'>{player.name}</span>
                                        {selectedWinner === player.id && <Crown className='w-5 h-5 ml-auto' />}
                                    </div>
                                </motion.button>
                            ))}
                        </div>

                        <Button onClick={confirmWinner} variant='caotiqueira' size='lg' className='w-full' disabled={!selectedWinner}>
                            <Trophy className='w-5 h-5 mr-2' />
                            Confirmar Vencedor
                        </Button>
                    </motion.div>
                )}

                {/* Results Phase */}
                {phase === 'results' && winner && (
                    <motion.div
                        key='results'
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className='w-full max-w-md text-center space-y-6'
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                            className='w-24 h-24 mx-auto rounded-full gradient-caotiqueira shadow-glow-caotiqueira flex items-center justify-center'
                        >
                            <Crown className='w-12 h-12 text-white' />
                        </motion.div>

                        <div>
                            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='text-3xl font-display font-bold text-foreground'>
                                🎉 {winner.name} venceu!
                            </motion.h2>
                            <p className='text-muted-foreground mt-2'>Melhor resposta da rodada {roundNumber}</p>
                        </div>

                        <div className='glass-card p-4 rounded-xl'>
                            <p className='text-sm text-muted-foreground mb-1'>Tema:</p>
                            <p className='text-lg font-medium text-caotiqueira'>"{currentTheme}"</p>
                        </div>

                        <div className='flex gap-3'>
                            <Button onClick={showScoreboard} variant='outline' size='lg' className='flex-1'>
                                <Trophy className='w-5 h-5 mr-2' />
                                Placar
                            </Button>
                            <Button onClick={nextRound} variant='caotiqueira' size='lg' className='flex-1'>
                                <Play className='w-5 h-5 mr-2' />
                                Próxima Rodada
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Scoreboard Phase */}
                {phase === 'scoreboard' && (
                    <motion.div key='scoreboard' initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className='w-full max-w-md space-y-6'>
                        <div className='text-center'>
                            <Trophy className='w-12 h-12 mx-auto text-caotiqueira mb-3' />
                            <h2 className='text-2xl font-display font-bold text-foreground'>Placar Geral</h2>
                            <p className='text-muted-foreground'>
                                Após {roundNumber} rodada{roundNumber > 1 ? 's' : ''}
                            </p>
                        </div>

                        <div className='space-y-3'>
                            {sortedPlayers.map((player, index) => (
                                <motion.div
                                    key={player.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`glass-card p-4 rounded-xl flex items-center justify-between ${index === 0 ? 'ring-2 ring-caotiqueira' : ''}`}
                                >
                                    <div className='flex items-center gap-3'>
                                        <span
                                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                                index === 0
                                                    ? 'gradient-caotiqueira text-white'
                                                    : index === 1
                                                    ? 'bg-gray-300 text-gray-700'
                                                    : index === 2
                                                    ? 'bg-amber-600 text-white'
                                                    : 'bg-muted text-muted-foreground'
                                            }`}
                                        >
                                            {index + 1}
                                        </span>
                                        <span className='font-medium'>{player.name}</span>
                                        {index === 0 && <Crown className='w-4 h-4 text-caotiqueira' />}
                                    </div>
                                    <span className='text-xl font-bold text-caotiqueira'>{player.score}</span>
                                </motion.div>
                            ))}
                        </div>

                        <div className='flex gap-3'>
                            <Button onClick={resetGame} variant='outline' size='lg' className='flex-1'>
                                <RotateCcw className='w-5 h-5 mr-2' />
                                Novo Jogo
                            </Button>
                            <Button onClick={nextRound} variant='caotiqueira' size='lg' className='flex-1'>
                                <Play className='w-5 h-5 mr-2' />
                                Continuar
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </Game.Container>
    );
}

export default Caotiqueira;
