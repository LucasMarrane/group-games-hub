import { useMultiplayer } from '@/hooks/useMultiplayer';
import * as Game from '@components/game';
import { Icon } from '@components/game/game.icon';
import { VexameGame } from '@data/vexame/theme';
import { Button } from '@shadcn/components/ui/button';
import { cn } from '@shadcn/lib/utils';
import { motion } from 'framer-motion';
import { Bird, RefreshCcw, Shuffle } from 'lucide-react';

export function Vexame() {
    const { startGame, gameState, changeGame: changeGameState } = useMultiplayer<any>();

    const { currentCardIndex = 0, shuffledCards = [] } = gameState ?? {};

    const questionsData = VexameGame.themes.flatMap((i) => i.items);

    function shuffle() {
        const shuffled = [...questionsData].sort(() => Math.random() - 0.5);
        return shuffled;
    }

    const currentQuestion = shuffledCards[currentCardIndex];

    const startNewGame = () => {
        startGame({ phase: 'playing', currentCardIndex: 0, shuffledCards: shuffle() });
    };

    const nextRound = () => {
        if (currentCardIndex < shuffledCards.length - 1) {
            changeGameState({ ...gameState, currentCardIndex: currentCardIndex + 1 });
        }
    };

    return (
        <Game.Container className='text-gradient-vexame' game={VexameGame} icon={<Icon variant='vexame' />} >
            <Game.Shuffle totalThemes={questionsData.length}>
                {currentQuestion ? (
                    <>
                        <motion.div
                            key={`vexame-${currentCardIndex}`}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className='bg-card rounded-2xl border border-border overflow-hidden'
                        >
                            {/* Theme Header */}
                            <div className='gradient-vexame p-4'>
                                <div className='flex items-center justify-between'>
                                    <h3 className='text-lg font-display font-bold text-white'>{currentQuestion.title}</h3>
                                </div>
                            </div>

                            {/* Question */}
                            <div className='p-6'>
                                <p className='text-md font-display text-foreground text-center mb-6'>{currentQuestion.description}</p>
                                {/* Answer Section */}
                                <div className='bg-muted rounded-xl p-2 flex items-center text-center'>
                                    <Bird className='mr-2'/><p className='text-sm text-white text-muted'>{currentQuestion.footer}</p>
                                </div>
                            </div>
                        </motion.div>

                        <div className='flex w-full gap-3'>
                            <Button onClick={nextRound} disabled={questionsData.length === 0} variant='outline' className='flex-1'>
                                <Shuffle className='w-4 h-4 mr-2' />
                                Sortear Outro
                            </Button>
                            <Button onClick={startNewGame} className='flex-1 gradient-accent border-0'>
                                <RefreshCcw className='w-4 h-4 mr-2' />
                                Resetar
                            </Button>
                        </div>
                    </>
                ) : (
                    <Button onClick={startNewGame} disabled={questionsData.length === 0} className='w-full h-16 text-lg font-display gradient-primary border-0 shadow-button'>
                        <Shuffle className={cn('w-5 h-5 mr-2')} />
                        {questionsData.length > 0 ? 'Sortear Tema' : 'Nenhum tema disponível'}
                    </Button>
                )}
            </Game.Shuffle>
        </Game.Container>
    );
}

export default Vexame;
