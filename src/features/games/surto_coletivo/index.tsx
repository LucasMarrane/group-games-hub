import { Icon } from '@components/game/game.icon';
import { SurtoColetivoGame } from '@data/surto_coletivo/theme';
import * as Game from '@components/game';
import { useState } from 'react';
import { SurtoColetivoItem, SurtoColetivoGameState, SurtoColetivoPlayer } from '@appTypes/surto_coletivo';
import { ArrowLeft, Crown, Heart, Play, RefreshCw, Shield, Skull, Sparkles, Swords, Trash2, Users, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from '@shadcn/components/ui/input';
import { Button } from '@shadcn/components/ui/button';

type GamePhase = 'menu' | 'create' | 'join' | 'lobby' | 'playing' | 'ended';
export function SurtoColetivo() {
    const [phase, setPhase] = useState<GamePhase>('menu');
    const [playerName, setPlayerName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [players, setPlayers] = useState<SurtoColetivoPlayer[]>([]);
    const [gameState, setGameState] = useState<SurtoColetivoGameState | null>(null);
    const [selectedCard, setSelectedCard] = useState<SurtoColetivoItem | null>(null);
    const [showCardDetail, setShowCardDetail] = useState(false);

    const cards = SurtoColetivoGame.themes.flatMap((i) => i.items);

    const createDeck = (): SurtoColetivoItem[] => {
        const deck = [...cards];
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    };

    const addLocalPlayer = () => {
        if (!playerName.trim()) return;
        const newPlayer: SurtoColetivoPlayer = {
            id: `player_${Date.now()}`,
            name: playerName.trim(),
            isAlive: true,
            isZombie: false,
            cards: [],
            activeEffects: [],
            isProtected: false,
            skipTurns: 0,
        };
        setPlayers((prev) => [...prev, newPlayer]);
        setPlayerName('');
        toast(`${players.length + 1} jogadores`);
    };

    const startGame = () => {
        if (players.length < 2) {
            toast('Mínimo 2 jogadores!');
            return;
        }

        const deck = createDeck();
        const cardsPerPlayer = Math.min(5, Math.floor(deck.length / players.length));

        const playersWithCards = players.map((p) => ({
            ...p,
            cards: deck.splice(0, cardsPerPlayer),
        }));

        setGameState({
            players: playersWithCards,
            currentPlayerIndex: 0,
            deck,
            discardPile: [],
            boardCards: [],
            direction: 1,
            phase: 'playing',
            winner: null,
            lastAction: null,
            turnPhase: 'draw',
            actionsThisTurn: 0,
            silenceMode: false,
            slowMotionTurns: 0,
            truceActive: false,
        });
        setPhase('playing');
    };

    const drawCard = () => {
        if (!gameState || gameState.deck.length === 0) return;

        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        const drawnCard = gameState.deck[0];
        const newDeck = gameState.deck.slice(1);

        if (drawnCard.category === 1) {
            const hasDefense = currentPlayer.cards.some((c) => c.action_code === 'cancel_surto' || c.auto_trigger);

            if (hasDefense) {
                const defenseCard = currentPlayer.cards.find((c) => c.action_code === 'cancel_surto' || c.auto_trigger);
                toast(`${defenseCard?.title} te protegeu!`);
                setGameState({
                    ...gameState,
                    deck: newDeck,
                    discardPile: [...gameState.discardPile, drawnCard, defenseCard!],
                    players: gameState.players.map((p, i) => (i === gameState.currentPlayerIndex ? { ...p, cards: p.cards.filter((c) => c.id !== defenseCard?.id) } : p)),
                    turnPhase: 'play',
                });
            } else {
                toast(`${currentPlayer.name} foi ELIMINADO!`);
                handleElimination(currentPlayer);
            }
        } else {
            setGameState({
                ...gameState,
                deck: newDeck,
                players: gameState.players.map((p, i) => (i === gameState.currentPlayerIndex ? { ...p, cards: [...p.cards, drawnCard] } : p)),
                turnPhase: 'play',
            });
        }
    };

    const handleElimination = (player: SurtoColetivoPlayer) => {
        if (!gameState) return;

        const deathTriggerCards = player.cards.filter((c) => c.trigger_on_death);

        deathTriggerCards.forEach((card) => {
            if (card.action_code === 'auto_revive' || card.action_code === 'phoenix') {
                toast(`${card.title} salvou ${player.name}!`);
                return;
            }
        });

        const updatedPlayers = gameState.players.map((p) => (p.id === player.id ? { ...p, isAlive: false } : p));

        const alivePlayers = updatedPlayers.filter((p) => p.isAlive || p.isZombie);

        if (alivePlayers.length === 1) {
            setGameState({ ...gameState, players: updatedPlayers, winner: alivePlayers[0], phase: 'ended' });
            setPhase('ended');
        } else {
            nextTurn({ ...gameState, players: updatedPlayers });
        }
    };

    const playCard = (card: SurtoColetivoItem, targetId?: string) => {
        if (!gameState) return;

        const currentPlayer = gameState.players[gameState.currentPlayerIndex];

        toast(card.description);

        const newPlayers = gameState.players.map((p, i) => (i === gameState.currentPlayerIndex ? { ...p, cards: p.cards.filter((c) => c.id !== card.id) } : p));

        setGameState({
            ...gameState,
            players: newPlayers,
            discardPile: [...gameState.discardPile, card],
            lastAction: { playerId: currentPlayer.id, playerName: currentPlayer.name, action: 'play', card },
        });

        setSelectedCard(null);
    };

    const nextTurn = (currentState?: SurtoColetivoGameState) => {
        const state = currentState || gameState;
        if (!state) return;

        let nextIndex = state.currentPlayerIndex;
        let attempts = 0;

        do {
            nextIndex = (nextIndex + state.direction + state.players.length) % state.players.length;
            attempts++;
        } while (!state.players[nextIndex].isAlive && !state.players[nextIndex].isZombie && attempts < state.players.length);

        setGameState({
            ...state,
            currentPlayerIndex: nextIndex,
            turnPhase: 'draw',
            actionsThisTurn: 0,
        });
    };

    const getCardTypeIcon = (type: string) => {
        switch (type) {
            case 'surto':
                return <Skull className='w-4 h-4' />;
            case 'defesa':
                return <Shield className='w-4 h-4' />;
            case 'ataque':
                return <Swords className='w-4 h-4' />;
            case 'caos':
                return <Zap className='w-4 h-4' />;
            case 'sobrevivencia':
                return <Heart className='w-4 h-4' />;
            default:
                return <Trash2 className='w-4 h-4' />;
        }
    };

    const getCardColor = (type: string) => {
        switch (type) {
            case 'surto':
                return 'from-red-600 to-red-900';
            case 'defesa':
                return 'from-blue-500 to-blue-700';
            case 'ataque':
                return 'from-orange-500 to-red-600';
            case 'caos':
                return 'from-purple-500 to-pink-600';
            case 'sobrevivencia':
                return 'from-green-500 to-emerald-600';
            default:
                return 'from-gray-500 to-gray-700';
        }
    };

    const currentPlayer = gameState?.players[gameState?.currentPlayerIndex];

    return (
        <Game.Container className='text-gradient-decisoes' game={SurtoColetivoGame} icon={<Icon variant='surto' />}>
            {phase === 'menu' && (
                <>
                    <div className='w-full max-w-sm space-y-3'>
                        <Input placeholder='Seu nome' value={playerName} onChange={(e) => setPlayerName(e.target.value)} className='text-center text-lg' />

                        <Button
                            onClick={() => {
                                if (playerName) setPhase('lobby');
                            }}
                            variant='surto'
                            size='lg'
                            className='w-full'
                            disabled={!playerName}
                        >
                            <Users className='w-5 h-5 mr-2' /> Jogar Local (Mesmo Celular)
                        </Button>
                    </div>
                </>
            )}

            {phase === 'lobby' && (
                <>
                    <div className='flex items-center gap-4 mb-6'>
                        <Button variant='ghost' size='icon' onClick={() => setPhase('menu')}>
                            <ArrowLeft />
                        </Button>
                        <h1 className='text-2xl font-display font-bold'>Lobby</h1>
                    </div>

                    <div className='flex-1 space-y-4'>
                        <div className='flex gap-2'>
                            <Input placeholder='Nome do jogador' value={playerName} onChange={(e) => setPlayerName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addLocalPlayer()} />
                            <Button onClick={addLocalPlayer} variant='surto'>
                                Adicionar
                            </Button>
                        </div>

                        <div className='space-y-2'>
                            {players.map((p, i) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className='p-4 rounded-xl bg-card border border-border flex items-center justify-between'
                                >
                                    <span className='font-display'>
                                        {i + 1}. {p.name}
                                    </span>
                                    <Button variant='ghost' size='sm' onClick={() => setPlayers((prev) => prev.filter((pl) => pl.id !== p.id))}>
                                        <Trash2 className='w-4 h-4' />
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <Button onClick={startGame} variant='surto' size='xl' className='w-full mt-4' disabled={players.length < 2}>
                        <Play className='w-6 h-6 mr-2' /> Começar ({players.length} jogadores)
                    </Button>
                </>
            )}

            {phase === 'playing' && gameState && (
                <>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='flex items-center gap-2'>
                            <div className='w-10 h-10 rounded-full gradient-surto flex items-center justify-center'>
                                <Skull className='w-5 h-5 text-white' />
                            </div>
                            <div>
                                <p className='text-xs text-muted-foreground'>Vez de</p>
                                <p className='font-display font-bold'>{currentPlayer?.name}</p>
                            </div>
                        </div>
                        <div className='text-right'>
                            <p className='text-xs text-muted-foreground'>Deck</p>
                            <p className='font-display font-bold'>{gameState.deck.length}</p>
                        </div>
                    </div>

                    {/* Players Status */}
                    <div className='flex gap-2 mb-4 overflow-x-auto pb-2'>
                        {gameState.players.map((p, i) => (
                            <div
                                key={p.id}
                                className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                                    i === gameState.currentPlayerIndex ? 'gradient-surto text-white' : p.isAlive ? 'bg-card border border-border' : 'bg-destructive/20 text-destructive line-through'
                                }`}
                            >
                                {p.isZombie && '🧟'} {p.name} ({p.cards.length})
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-2 mb-4'>
                        {gameState.turnPhase === 'draw' && (
                            <Button onClick={drawCard} variant='surto' className='flex-1'>
                                <Sparkles className='w-5 h-5 mr-2' /> Comprar Carta
                            </Button>
                        )}
                        {gameState.turnPhase === 'play' && (
                            <Button onClick={() => nextTurn()} variant='outline' className='flex-1'>
                                <RefreshCw className='w-5 h-5 mr-2' /> Passar Vez
                            </Button>
                        )}
                    </div>

                    {/* Current Player's Hand */}
                    <div className='flex-1 overflow-y-auto'>
                        <p className='text-sm text-muted-foreground mb-2'>Mão de {currentPlayer?.name}:</p>
                        <div className='grid grid-cols-2 gap-2'>
                            {currentPlayer?.cards.map((card) => (
                                <motion.div
                                    key={card.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setSelectedCard(card);
                                        setShowCardDetail(true);
                                    }}
                                    className={`p-3 rounded-xl bg-gradient-to-br  text-white cursor-pointer`}
                                    // className={`p-3 rounded-xl bg-gradient-to-br ${getCardColor(card.type)} text-white cursor-pointer`}
                                >
                                    <div className='flex items-center gap-2 mb-1'>
                                        {/* {getCardTypeIcon(card.type)} */}
                                        <span className='font-display text-sm font-bold truncate'>{card.title}</span>
                                    </div>
                                    <p className='text-xs opacity-80 line-clamp-2'>{card.description}</p>
                                    <p className='text-[10px] mt-2 opacity-60 italic'>{card.footer}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Card Detail Modal */}
                    <AnimatePresence>
                        {showCardDetail && selectedCard && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className='fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6'
                                onClick={() => setShowCardDetail(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    className={`w-full max-w-sm p-6 rounded-2xl bg-gradient-to-br`}
                                    // className={`w-full max-w-sm p-6 rounded-2xl bg-gradient-to-br ${getCardColor(selectedCard.type)}`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className='flex items-center gap-3 mb-4'>
                                        {/* {getCardTypeIcon(selectedCard.category)} */}
                                        <h2 className='text-xl font-display font-bold text-white'>{selectedCard.title}</h2>
                                    </div>
                                    <p className='text-white/90 mb-4'>{selectedCard.description}</p>
                                    <p className='text-sm text-white/60 italic mb-6'>{selectedCard.footer}</p>

                                    {gameState.turnPhase === 'play' && selectedCard.category !== 1 && (
                                        <Button
                                            onClick={() => {
                                                playCard(selectedCard);
                                                setShowCardDetail(false);
                                            }}
                                            variant='secondary'
                                            className='w-full'
                                        >
                                            Jogar Carta
                                        </Button>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}

            {phase === 'ended' && gameState?.winner && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className='text-center'>
                    <Crown className='w-20 h-20 mx-auto mb-4 text-yellow-500' />
                    <h1 className='text-4xl font-display font-bold mb-2'>{gameState.winner.name}</h1>
                    <p className='text-muted-foreground mb-8'>Sobreviveu ao Surto Coletivo!</p>
                    <Button
                        onClick={() => {
                            setPhase('menu');
                            setPlayers([]);
                            setGameState(null);
                        }}
                        variant='surto'
                        size='lg'
                    >
                        Jogar Novamente
                    </Button>
                </motion.div>
            )}
        </Game.Container>
    );
}

export default SurtoColetivo;
