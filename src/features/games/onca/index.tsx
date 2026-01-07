import { OncaPlayer } from '@appTypes/onca';
import * as Game from '@components/game';
import { Icon } from '@components/game/game.icon';
import { OncaGame } from '@data/onca/theme';
import { Button } from '@shadcn/components/ui/button';
import { Input } from '@shadcn/components/ui/input';
import { motion } from 'framer-motion';
import { Cat, ChevronRight, RotateCcw, Trash2, Trophy, UserPlus, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

type GamePhase = 'setup' | 'question' | 'voting' | 'results';
export function Onca() {
    const [phase, setPhase] = useState<GamePhase>('setup');
    const [players, setPlayers] = useState<OncaPlayer[]>([]);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [usedQuestions, setUsedQuestions] = useState<number[]>([]);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const [roundWinner, setRoundWinner] = useState<OncaPlayer | null>(null);

    const questionsData = OncaGame.themes.flatMap((i) => i.items);

    const shuffledQuestions = useMemo(() => {
        return [...questionsData].sort(() => Math.random() - 0.5);
    }, []);

    const currentQuestion = shuffledQuestions[currentQuestionIndex];

    const addPlayer = () => {
        if (newPlayerName.trim() && players.length < 10) {
            setPlayers([...players, { id: Date.now().toString(), name: newPlayerName.trim(), votes: 0 }]);
            setNewPlayerName('');
        }
    };

    const removePlayer = (id: string) => {
        setPlayers(players.filter((p) => p.id !== id));
    };

    const startGame = () => {
        if (players.length >= 3) {
            setPhase('question');
        }
    };

    const showVoting = () => {
        setPhase('voting');
        setSelectedPlayerId(null);
    };

    const submitVote = () => {
        if (selectedPlayerId) {
            const winner = players.find((p) => p.id === selectedPlayerId);
            if (winner) {
                setPlayers(players.map((p) => (p.id === selectedPlayerId ? { ...p, votes: p.votes + 1 } : p)));
                setRoundWinner(winner);
            }
            setPhase('results');
        }
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < shuffledQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setUsedQuestions([...usedQuestions, currentQuestion.id]);
            setRoundWinner(null);
            setPhase('question');
        }
    };

    const resetGame = () => {
        setPhase('setup');
        setPlayers(players.map((p) => ({ ...p, votes: 0 })));
        setCurrentQuestionIndex(0);
        setUsedQuestions([]);
        setRoundWinner(null);
    };

    const sortedPlayers = [...players].sort((a, b) => b.votes - a.votes);
    return (
        <Game.Container className='text-gradient-onca' game={OncaGame} icon={<Icon variant='onca' />}>
            {phase === 'setup' && (
                <>
                    {/* Add Players */}
                    <div className='bg-card/50 backdrop-blur rounded-2xl p-4 mb-4'>
                        <h2 className='font-display font-semibold text-foreground mb-3 flex items-center gap-2'>
                            <Users className='w-5 h-5 text-onca' />
                            Jogadores ({players.length}/10)
                        </h2>
                        <div className='flex gap-2 mb-3'>
                            <Input
                                placeholder='Nome do jogador'
                                value={newPlayerName}
                                onChange={(e) => setNewPlayerName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                                className='flex-1'
                            />
                            <Button onClick={addPlayer} size='icon' variant='onca'>
                                <UserPlus className='w-4 h-4' />
                            </Button>
                        </div>

                        <div className='space-y-2 max-h-48 overflow-y-auto'>
                            {players.map((player, index) => (
                                <motion.div
                                    key={player.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className='flex items-center justify-between bg-muted/50 rounded-xl px-3 py-2'
                                >
                                    <span className='text-foreground'>{player.name}</span>
                                    <Button variant='ghost' size='icon' onClick={() => removePlayer(player.id)} className='h-8 w-8 text-muted-foreground hover:text-destructive'>
                                        <Trash2 className='w-4 h-4' />
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {players.length < 3 && <p className='text-center text-muted-foreground text-sm mb-4'>Mínimo de 3 jogadores para começar</p>}

                    <Button onClick={startGame} disabled={players.length < 3} variant='onca' size='lg' className='mt-auto'>
                        Começar Jogo
                        <ChevronRight className='w-5 h-5 ml-2' />
                    </Button>
                </>
            )}

            {phase === 'question' && currentQuestion && (
                <motion.div
                    key='question'
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className='flex-1 flex flex-col items-center justify-center'
                >
                    <div className='text-center mb-8'>
                        <span className='text-onca text-sm font-medium'>
                            Pergunta {currentQuestionIndex + 1} de {shuffledQuestions.length}
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

                    <Button onClick={showVoting} variant='onca' size='lg'>
                        Votar
                        <ChevronRight className='w-5 h-5 ml-2' />
                    </Button>
                </motion.div>
            )}

            {phase === 'voting' && (
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

                    <Button onClick={submitVote} disabled={!selectedPlayerId} variant='onca' size='lg' className='mt-auto'>
                        Confirmar Voto
                    </Button>
                </motion.div>
            )}

            {phase === 'results' && (
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
                        <p className='text-3xl font-display font-bold text-onca'>{roundWinner?.name}</p>
                    </div>

                    {/* Scoreboard */}
                    <div className='bg-card/50 backdrop-blur rounded-2xl p-4 mb-6'>
                        <h3 className='font-display font-semibold text-foreground mb-3 flex items-center gap-2'>
                            <Trophy className='w-5 h-5 text-onca' />
                            Placar
                        </h3>
                        <div className='space-y-2'>
                            {sortedPlayers.map((player, index) => (
                                <div key={player.id} className='flex items-center justify-between bg-muted/50 rounded-xl px-3 py-2'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-onca font-bold'>#{index + 1}</span>
                                        <span className='text-foreground'>{player.name}</span>
                                    </div>
                                    <span className='font-display font-bold text-onca'>{player.votes} pts</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='mt-auto space-y-3'>
                        {currentQuestionIndex < shuffledQuestions.length - 1 ? (
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
