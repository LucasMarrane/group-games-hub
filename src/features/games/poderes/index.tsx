import { useMultiplayer } from '@/hooks/useMultiplayer';
import { Icon } from '@components/game';
import { PoderesGame } from '@data/poderes/theme';
import * as Game from '@components/game';
import { motion } from 'framer-motion';
import { Button } from '@shadcn/components/ui/button';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@shadcn/components/ui/input';

export function Poderes() {
    const { isHost, startGame, localPlayerId, gameState, changeGame: changeGameState, players, setPlayers } = useMultiplayer<any>();
    const { currentCardIndex = 0, phase, shuffledCards = [], step, winner } = gameState ?? {};

    const [text, setText] = useState('');
    const [selectedId, setSelectedId] = useState<any>(null);

    const questionsData = PoderesGame.themes.flatMap((i) => i.items);

    function shuffle() {
        const shuffled = [...questionsData].sort(() => Math.random() - 0.5);
        return shuffled;
    }

    const currentQuestion = shuffledCards[currentCardIndex];

    // Start game and distribute cards
    const startNewGame = () => {
        const _players = players.map((p) => {
            p.metadata = { response: { playerId: p.id }, voted: false, submited: false };
            p.points = 0;
            return p;
        });
        startGame({ phase: 'playing', step: 'question', currentCardIndex: 0, shuffledCards: shuffle() });
        setPlayers(_players);
    };

    const startWriting = () => {
        changeGameState({ ...gameState, step: 'writing' });
    };

    const submitCard = () => {
        const _players = players.map((p) => {
            p.metadata.submited = p.id == localPlayerId ? true : p.metadata.submited;
            p.metadata.response.text = p.id == localPlayerId ? text : p.metadata.response.text;
            return p;
        });
        setPlayers(_players);
        const allSubmited = _players.every((pl) => pl?.metadata?.submited);
        if (allSubmited) {
            changeGameState({ ...gameState, step: 'voting' });
        }
    };

    const submitVote = () => {
        const _players = players.map((p) => {
            p.metadata.voted = p.id == localPlayerId ? true : p.metadata.voted;
            p.metadata.voteId = p.id == localPlayerId ? selectedId : p.metadata.voteId;
            return p;
        });
        const allVote = _players.every((pl) => pl?.metadata?.voted);
        setPlayers(_players);
        if (allVote) {
            const chosenCards = players?.map((p) => ({ ...p?.metadata?.response }));

            const votes: Record<string, number> = {};
            _players.forEach((p) => {
                if (p.metadata.voted && p.metadata.voteId) {
                    votes[p.metadata.voteId] = (votes[p.metadata.voteId] || 0) + 1;
                }
            });

            const id = Object.keys(votes).reduce((a: any, b: any) => (votes[a] > votes[b] ? a : b), null as string | null);
            const winner = chosenCards.find((i) => i.playerId == id);

            setPlayers(players.map((i) => ({ ...i, points: winner.playerId == i.id ? i.points! + 1 : i.points })));

            changeGameState({ ...gameState, step: 'results', winner });
        }
    };

    const nextRound = () => {
        if (currentCardIndex < shuffledCards.length - 1) {
            const _players = players.map((p) => {
                p.metadata = { response: { playerId: p.id }, voted: false, submited: false };
                return p;
            });
            setPlayers(_players);
            changeGameState({ ...gameState, currentCardIndex: currentCardIndex + 1, step: 'question' });
        }
    };

    const resetGame = () => {
        startNewGame();
    };

    const player = players?.find((p) => p.id == localPlayerId);
    const cardsPlayers = players?.map((p) => p?.metadata?.response);

    return (
        <Game.Container className='text-gradient-poderes' game={PoderesGame} icon={<Icon variant='poderes' />} onStart={startNewGame} showMultiplayer>
            {phase == 'playing' && (
                <motion.div
                    key={`poderes-${currentCardIndex}`}
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
                                    Carta {currentCardIndex + 1} de {shuffledCards.length}
                                </span>
                            </div>

                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className='bg-card/80 backdrop-blur rounded-3xl p-8 shadow-glow-poderes mb-8 max-w-md'
                            >
                                <p className='text-xl font-display font-semibold text-foreground text-center'>{currentQuestion.title}</p>
                            </motion.div>

                            <Button onClick={startWriting} variant='poderes' size='lg' disabled={!isHost}>
                                Começar
                                <ChevronRight className='w-5 h-5 ml-2' />
                            </Button>
                        </motion.div>
                    )}

                    {step == 'writing' && (
                        <>
                            <motion.div
                                key='question'
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className='flex-1 flex flex-col items-center justify-center'
                            >
                                <div className='text-center mb-8'>
                                    <span className='text-onca text-sm font-medium'>
                                        Carta {currentCardIndex + 1} de {shuffledCards.length}
                                    </span>
                                </div>

                                <motion.div
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className='bg-card/80 backdrop-blur rounded-3xl p-8 shadow-glow-poderes mb-8 max-w-md'
                                >
                                    <p className='text-xl font-display font-semibold text-foreground text-center'>{currentQuestion.title}</p>
                                </motion.div>

                                <div className='w-full m-4'>
                                    <div className='glass-card p-4 rounded-xl space-y-3'>
                                        <div className='flex items-center gap-2 mb-2'>
                                            <span className='font-medium'>Destrua o poder</span>
                                        </div>
                                        <div className='flex gap-2'>
                                            <Input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitCard()} className='flex-1' maxLength={100} />
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={submitCard} variant='poderes' size='lg' disabled={player?.metadata?.submited}>
                                    Enviar
                                    <ChevronRight className='w-5 h-5 ml-2' />
                                </Button>
                            </motion.div>
                        </>
                    )}

                    {step == 'voting' && (
                        <>
                            <motion.div
                                key='question'
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className='flex-1 flex flex-col items-center justify-center'
                            >
                                <motion.div
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className='bg-card/80 backdrop-blur rounded-3xl p-8 shadow-glow-poderes mb-8 max-w-md'
                                >
                                    <p className='text-xl font-display font-semibold text-foreground text-center'>{currentQuestion.title}</p>
                                    <p className='text-muted-foreground text-md'>{currentQuestion.footer}</p>
                                    <p className='text-muted-foreground text-sm italic font-bold'>Ass: Nelson, o pombo da discórdia</p>
                                </motion.div>

                                <div className='text-center mb-8'>
                                    <span className='text-white text-sm font-medium'>Escolha</span>
                                </div>

                                <div className='grid  grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 md:grid-cols-2 gap-3'>
                                    {cardsPlayers?.map((i: any) => (
                                        <motion.div
                                            initial={{ y: 50, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className={`bg-card/10 backdrop-blur border rounded-3xl p-8 ${i?.playerId == selectedId ? 'shadow-glow-onca' : ''}  mb-2 max-w-md`}
                                            onClick={() => {
                                                setSelectedId(i.playerId);
                                            }}
                                        >
                                            <p className='text-xl font-display font-semibold text-foreground text-center'>{i.text}</p>
                                        </motion.div>
                                    ))}
                                </div>
                                <Button onClick={submitVote} variant='poderes' size='lg' disabled={player?.metadata?.voted}>
                                    Votar
                                    <ChevronRight className='w-5 h-5 ml-2' />
                                </Button>
                            </motion.div>
                        </>
                    )}
                    {step == 'results' && (
                        <>
                            <motion.div
                                key='question'
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className='flex-1 flex flex-col items-center justify-center'
                            >
                                <motion.div
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className='bg-card/80 backdrop-blur rounded-3xl p-8 shadow-glow-poderes mb-8 max-w-md'
                                >
                                    <p className='text-xl font-display font-semibold text-foreground text-center'>{currentQuestion.title}</p>
                                    <p className='text-muted-foreground text-md'>{currentQuestion.footer}</p>
                                    <p className='text-muted-foreground text-sm italic font-bold'>Ass: Nelson, o pombo da discórdia</p>
                                </motion.div>

                                <div className='flex justify-center'>
                                    <motion.div
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className={`bg-card/10 backdrop-blur border rounded-3xl p-8 shadow-glow-onca  mb-2 max-w-md`}
                                    >
                                        <p className='text-xl font-display font-semibold text-foreground text-center'>{winner?.text}</p>
                                    </motion.div>
                                </div>
                                <div className='space-y-3'>
                                    <Button onClick={nextRound} variant='decisoes' size='lg' className='w-full' disabled={!isHost}>
                                        Próxima Rodada
                                        <ChevronRight className='w-5 h-5 ml-2' />
                                    </Button>
                                    <Button onClick={resetGame} variant='outline' size='lg' className='w-full' disabled={!isHost}>
                                        <RotateCcw className='w-4 h-4 mr-2' />
                                        Novo Jogo
                                    </Button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </motion.div>
            )}
        </Game.Container>
    );
}

export default Poderes;
