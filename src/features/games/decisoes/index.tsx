import { DecisoesVote } from '@appTypes/decisoes';
import * as Game from '@components/game';
import { DecisoesGame } from '@data/decisoes/theme';
import { Button } from '@shadcn/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronRight, Crown, Eye, EyeOff, RotateCcw, Skull, ThumbsDown, ThumbsUp, Trophy } from 'lucide-react';
import { useMemo, useState } from 'react';

type GamePhase = 'intro' | 'question' | 'voting' | 'hostGuess' | 'reveal' | 'scoreboard';

export function Decisoes() {
    const [phase, setPhase] = useState<GamePhase>('intro');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [hostScore, setHostScore] = useState(0);
    const [roundsPlayed, setRoundsPlayed] = useState(0);
    const [votes, setVotes] = useState<DecisoesVote[]>([]);
    const [currentVoter, setCurrentVoter] = useState(0);
    const [totalVoters, setTotalVoters] = useState(4);
    const [hostGuess, setHostGuess] = useState<'A' | 'B' | null>(null);
    const [showResult, setShowResult] = useState(false);

    const questionsData = DecisoesGame.themes.flatMap((i) => i.items);
    const shuffledQuestions = useMemo(() => {
        return [...questionsData].sort(() => Math.random() - 0.5);
    }, []);

    const currentQuestion = shuffledQuestions[currentQuestionIndex];

    const votesA = votes.filter((v) => v.option === 'A').length;
    const votesB = votes.filter((v) => v.option === 'B').length;
    const majorityOption = votesA >= votesB ? 'A' : 'B';
    const hostWon = hostGuess === majorityOption;

    const startRound = () => {
        setPhase('question');
        setVotes([]);
        setCurrentVoter(0);
        setHostGuess(null);
        setShowResult(false);
    };

    const startVoting = () => {
        setPhase('voting');
        setCurrentVoter(1);
    };

    const submitVote = (option: 'A' | 'B') => {
        setVotes([...votes, { visceralVoterId: currentVoter, option }]);

        if (currentVoter < totalVoters) {
            setCurrentVoter(currentVoter + 1);
        } else {
            setPhase('hostGuess');
        }
    };

    const submitHostGuess = (guess: 'A' | 'B') => {
        setHostGuess(guess);
        setPhase('reveal');
    };

    const revealResult = () => {
        setShowResult(true);
        if (hostWon) {
            setHostScore(hostScore + 1);
        }
    };

    const nextRound = () => {
        if (currentQuestionIndex < shuffledQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setRoundsPlayed(roundsPlayed + 1);
            startRound();
        } else {
            setPhase('scoreboard');
        }
    };

    const resetGame = () => {
        setPhase('intro');
        setCurrentQuestionIndex(0);
        setHostScore(0);
        setRoundsPlayed(0);
        setVotes([]);
        setHostGuess(null);
    };
    const [optionA = '', optionB = ''] = currentQuestion.title.split('OU');
    return (
        <Game.Container className='text-gradient-decisoes' game={DecisoesGame}>
            {phase === 'intro' && (
                <motion.div key='intro' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className='flex-1 flex flex-col items-center justify-center'>
                    <div className='bg-card/50 backdrop-blur rounded-2xl p-4 mb-8 w-full max-w-sm'>
                        <h3 className='font-display font-semibold text-foreground mb-3'>Quantos votantes?</h3>
                        <div className='flex gap-2 justify-center'>
                            {[3, 4, 5, 6, 7, 8].map((num) => (
                                <Button key={num} variant={totalVoters === num ? 'decisoes' : 'outline'} size='sm' onClick={() => setTotalVoters(num)} className='w-10 h-10'>
                                    {num}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <Button onClick={startRound} variant='decisoes' size='lg'>
                        Começar
                        <ChevronRight className='w-5 h-5 ml-2' />
                    </Button>
                </motion.div>
            )}

            {phase === 'question' && currentQuestion && (
                <motion.div key='question' initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className='flex-1 flex flex-col'>
                    <div className='text-center mb-6'>
                        <span className='text-decisoes text-sm font-medium'>Rodada {roundsPlayed + 1}</span>
                        <div className='flex items-center justify-center gap-2 mt-2'>
                            <Crown className='w-4 h-4 text-decisoes' />
                            <span className='text-foreground'>Host: {hostScore} pts</span>
                        </div>
                    </div>

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

            {phase === 'voting' && currentQuestion && (
                <motion.div key='voting' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className='flex-1 flex flex-col'>
                    <div className='text-center mb-6'>
                        <EyeOff className='w-8 h-8 mx-auto mb-2 text-decisoes' />
                        <h2 className='text-xl font-display font-bold text-foreground'>
                            Jogador {currentVoter} de {totalVoters}
                        </h2>
                        <p className='text-muted-foreground text-sm'>Vote em segredo! Passe o celular escondido.</p>
                    </div>

                    <div className='flex-1 flex flex-col gap-4 mx-2 justify-center'>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => submitVote('A')}
                            className='bg-gradient-to-r from-rose-500/30 to-rose-600/20 border-2 border-rose-500/50 rounded-2xl p-6 text-left hover:shadow-lg hover:shadow-rose-500/20 transition-all'
                        >
                            <span className='text-rose-400 font-bold text-lg mb-2 block'>A</span>
                            <p className='text-foreground font-display'>{optionA}</p>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => submitVote('B')}
                            className='bg-gradient-to-r from-violet-500/30 to-violet-600/20 border-2 border-violet-500/50 rounded-2xl p-6 text-left hover:shadow-lg hover:shadow-violet-500/20 transition-all'
                        >
                            <span className='text-violet-400 font-bold text-lg mb-2 block'>B</span>
                            <p className='text-foreground font-display'>{optionB}</p>
                        </motion.button>
                    </div>
                </motion.div>
            )}

            {phase === 'hostGuess' && (
                <motion.div
                    key='hostGuess'
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className='flex-1 flex flex-col items-center justify-center'
                >
                    <Crown className='w-16 h-16 mb-4 text-decisoes' />
                    <h2 className='text-2xl font-display font-bold text-foreground mb-2'>Vez do Host!</h2>
                    <p className='text-muted-foreground text-center mb-8 max-w-sm'>Qual opção foi a mais votada?</p>

                    <div className='w-full max-w-sm space-y-4'>
                        <Button onClick={() => submitHostGuess('A')} variant='outline' size='lg' className='w-full border-rose-500/50 hover:bg-rose-500/20'>
                            <ThumbsUp className='w-5 h-5 mr-2 text-rose-400' />
                            Opção A
                        </Button>
                        <Button onClick={() => submitHostGuess('B')} variant='outline' size='lg' className='w-full border-violet-500/50 hover:bg-violet-500/20'>
                            <ThumbsDown className='w-5 h-5 mr-2 text-violet-400' />
                            Opção B
                        </Button>
                    </div>
                </motion.div>
            )}

            {phase === 'reveal' && (
                <motion.div key='reveal' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='flex-1 flex flex-col items-center justify-center'>
                    {!showResult ? (
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className='text-center'>
                            <Eye className='w-16 h-16 mx-auto mb-4 text-decisoes animate-pulse' />
                            <h2 className='text-2xl font-display font-bold text-foreground mb-6'>Hora da Revelação!</h2>
                            <Button onClick={revealResult} variant='decisoes' size='lg'>
                                Revelar Resultado
                            </Button>
                        </motion.div>
                    ) : (
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

                            <div className='flex justify-center gap-8 my-6'>
                                <div className='text-center'>
                                    <div className={`text-4xl font-display font-bold ${majorityOption === 'A' ? 'text-rose-400' : 'text-muted-foreground'}`}>{votesA}</div>
                                    <span className='text-muted-foreground text-sm'>Opção A</span>
                                </div>
                                <div className='text-center'>
                                    <div className={`text-4xl font-display font-bold ${majorityOption === 'B' ? 'text-violet-400' : 'text-muted-foreground'}`}>{votesB}</div>
                                    <span className='text-muted-foreground text-sm'>Opção B</span>
                                </div>
                            </div>

                            <p className='text-muted-foreground mb-6'>
                                A maioria escolheu: <span className={majorityOption === 'A' ? 'text-rose-400 font-bold' : 'text-violet-400 font-bold'}>Opção {majorityOption}</span>
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
                    )}
                </motion.div>
            )}

            {phase === 'scoreboard' && (
                <motion.div key='scoreboard' initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className='flex-1 flex flex-col items-center justify-center'>
                    <Trophy className='w-20 h-20 mb-4 text-decisoes' />
                    <h2 className='text-2xl font-display font-bold text-foreground mb-2'>Fim do Jogo!</h2>
                    <p className='text-muted-foreground mb-6'>
                        O Host acertou {hostScore} de {roundsPlayed + 1} rodadas!
                    </p>

                    <div className='bg-card/50 backdrop-blur rounded-2xl p-6 mb-8 text-center'>
                        <span className='text-6xl font-display font-bold text-decisoes'>{Math.round((hostScore / (roundsPlayed + 1)) * 100)}%</span>
                        <p className='text-muted-foreground mt-2'>Taxa de acerto</p>
                    </div>

                    <Button onClick={resetGame} variant='decisoes' size='lg' className='w-full max-w-sm'>
                        <RotateCcw className='w-4 h-4 mr-2' />
                        Jogar Novamente
                    </Button>
                </motion.div>
            )}
        </Game.Container>
    );
}

export default Decisoes;
