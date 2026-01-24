import { useMultiplayer } from '@/hooks/useMultiplayer';
import { Icon } from '@components/game';
import { CaotiqueiraGame } from '@data/caotiqueira/theme';
import * as Game from '@components/game';
import { motion } from 'framer-motion';
import { Button } from '@shadcn/components/ui/button';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { useState } from 'react';

export function Caotiqueira() {
    const { isHost, startGame, localPlayerId, gameState, changeGame: changeGameState, players, setPlayers } = useMultiplayer<any>();
    const { currentCardIndex = 0, phase, shuffledCards = [], step, winner } = gameState ?? {};

    const [selected, setSelected] = useState<any>(null);
    const [selectedId, setSelectedId] = useState<any>(null);

    const questionsDataBlack = CaotiqueiraGame.blackCards;
    const questionsDataWhite = CaotiqueiraGame.whiteCards;

    function shuffleBlack() {
        const shuffled = [...questionsDataBlack].sort(() => Math.random() - 0.5);
        return shuffled;
    }

    function shuffleWhite() {
        const shuffled = [...questionsDataWhite].sort(() => Math.random() - 0.5);
        return shuffled;
    }

    const currentQuestion = shuffledCards[currentCardIndex];

    // Start game and distribute cards
    const startNewGame = () => {
        const cards = shuffleWhite();
        const _players = players.map((p, idx) => {
            p.metadata = { cards: cards.splice(idx * 5, 5), voted: false, submited: false };
            p.points = 0;
            return p;
        });
        startGame({ phase: 'playing', step: 'question', currentCardIndex: 0, shuffledCards: shuffleBlack() });
        setPlayers(_players);
    };

    const startWriting = () => {
        changeGameState({ ...gameState, step: 'writing' });
    };

    const submitCard = () => {
        const _players = players.map((p) => {
            p.metadata.submited = p.id == localPlayerId ? true : p.metadata.submited;
            p.metadata.selected = p.id == localPlayerId ? selected : p.metadata.selected;
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
            const chosenCards = players?.map((p) => ({ ...p?.metadata?.selected, playerId: p.id }));

            const votes: Record<string, number> = {};
            _players.forEach((p) => {
                if (p.metadata.voted && p.metadata.voteId) {
                    votes[p.metadata.voteId] = (votes[p.metadata.voteId] || 0) + 1;
                }
            });

            const id = Object.keys(votes).reduce((a: any, b: any) => (votes[a] > votes[b] ? a : b), null as string | null);
            const winner = chosenCards.find((i) => i.id == id);

            setPlayers(players.map((i) => ({ ...i, points: winner.playerId == i.id ? i.points! + 1 : i.points })));

            changeGameState({ ...gameState, step: 'results', winner });
        }
    };

    const nextRound = () => {
        if (currentCardIndex < shuffledCards.length - 1) {
            const cards = shuffleWhite();
            const _players = players.map((p, idx) => {
                p.metadata = { cards: cards.splice(idx * 5, 5), voted: false, submited: false };
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
    const cardsPlayers = players?.map((p) => p?.metadata?.selected);

    return (
        <Game.Container className='text-gradient-caotiqueira' game={CaotiqueiraGame} icon={<Icon variant='caotiqueira' />} onStart={startNewGame} showMultiplayer>
            {phase == 'playing' && (
                <motion.div
                    key={`caotiqueira-${currentCardIndex}`}
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
                                className='bg-card/80 backdrop-blur rounded-3xl p-8 shadow-glow-caotiqueira mb-8 max-w-md'
                            >
                                <p className='text-xl font-display font-semibold text-foreground text-center'>{currentQuestion.title}</p>
                            </motion.div>

                            <Button onClick={startWriting} variant='caotiqueira' size='lg' disabled={!isHost}>
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
                                        Pergunta {currentCardIndex + 1} de {shuffledCards.length}
                                    </span>
                                </div>

                                <motion.div
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className='bg-card/80 backdrop-blur rounded-3xl p-8 shadow-glow-caotiqueira mb-8 max-w-md'
                                >
                                    <p className='text-xl font-display font-semibold text-foreground text-center'>{currentQuestion.title}</p>
                                </motion.div>

                                <div className='text-center mb-8'>
                                    <span className='text-white text-sm font-medium'>Escolha</span>
                                </div>

                                <div className='grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 md:grid-cols-2'>
                                    {player?.metadata?.cards?.map((i: any) => (
                                        <motion.div
                                            initial={{ y: 50, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className={`bg-card/10 backdrop-blur rounded-3xl p-8 ${i.id == selected?.id ? 'shadow-glow-onca' : ''}  mb-2 max-w-md`}
                                            onClick={() => {
                                                setSelected(i);
                                            }}
                                        >
                                            <p className='text-xl font-display font-semibold text-foreground text-center'>{i.title}</p>
                                        </motion.div>
                                    ))}
                                </div>
                                <Button onClick={submitCard} variant='caotiqueira' size='lg' disabled={player?.metadata?.submited}>
                                    Escolher carta
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
                                    className='bg-card/80 backdrop-blur rounded-3xl p-8 shadow-glow-caotiqueira mb-8 max-w-md'
                                >
                                    <p className='text-xl font-display font-semibold text-foreground text-center'>{currentQuestion.title}</p>
                                    <p className='text-muted-foreground text-md'>{currentQuestion.footer}</p>
                                    <p className='text-muted-foreground text-sm italic font-bold'>Ass: Nelson, o pombo da discórdia</p>
                                </motion.div>

                                <div className='text-center mb-8'>
                                    <span className='text-white text-sm font-medium'>Escolha</span>
                                </div>

                                <div className='grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 md:grid-cols-2'>
                                    {cardsPlayers?.map((i: any) => (
                                        <motion.div
                                            initial={{ y: 50, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className={`bg-card/10 backdrop-blur rounded-3xl p-8 ${i?.id == selectedId ? 'shadow-glow-onca' : ''}  mb-2 max-w-md`}
                                            onClick={() => {
                                                setSelectedId(i.id);
                                            }}
                                        >
                                            <p className='text-xl font-display font-semibold text-foreground text-center'>{i.title}</p>
                                        </motion.div>
                                    ))}
                                </div>
                                <Button onClick={submitVote} variant='caotiqueira' size='lg' disabled={player?.metadata?.voted}>
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
                                    className='bg-card/80 backdrop-blur rounded-3xl p-8 shadow-glow-caotiqueira mb-8 max-w-md'
                                >
                                    <p className='text-xl font-display font-semibold text-foreground text-center'>{currentQuestion.title}</p>
                                    <p className='text-muted-foreground text-md'>{currentQuestion.footer}</p>
                                    <p className='text-muted-foreground text-sm italic font-bold'>Ass: Nelson, o pombo da discórdia</p>
                                </motion.div>

                                <div className='grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 md:grid-cols-2'>
                                    <motion.div
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className={`bg-card/10 backdrop-blur rounded-3xl p-8 shadow-glow-onca  mb-2 max-w-md`}
                                    >
                                        <p className='text-xl font-display font-semibold text-foreground text-center'>{winner?.title}</p>
                                        <p className='text-muted-foreground text-md'>{winner.footer}</p>
                                        <p className='text-muted-foreground text-sm italic font-bold'>Ass: Nelson, o pombo da discórdia</p>
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

export default Caotiqueira;
