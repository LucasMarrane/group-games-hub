import { GameCard, GameCardVariant } from '@components/GameCard';
import { CaotiqueiraGame } from '@data/caotiqueira/theme';
import { DecisoesGame } from '@data/decisoes/theme';
import { MimicaGame, PalpiteiroGame, SincroniaGame } from '@data/index';
import { OncaGame } from '@data/onca/theme';
import * as Player from '@components/player';
import { motion } from 'framer-motion';
import { Users, Target, Bird, Cat, Skull, Zap } from 'lucide-react';

export const games = [
    { route: 'sincronia', variant: 'sincronia', delay: 0.3, item: SincroniaGame, icon: Target },
    { route: 'mimica', variant: 'mimica', delay: 0.4, item: MimicaGame, icon: Users },
    { route: 'palpiteiro', variant: 'palpiteiro', delay: 0.5, item: PalpiteiroGame, icon: Bird },
    { route: 'onca', variant: 'onca', delay: 0.6, item: OncaGame, icon: Cat },
    { route: 'decisoes', variant: 'decisoes', delay: 0.7, item: DecisoesGame, icon: Skull },
    { route: 'caotiqueira', variant: 'caotiqueira', delay: 0.8, item: CaotiqueiraGame, icon: Zap },
];

export default function Home() {
    return (
        <div className='min-h-screen  p-6 flex flex-col safe-area-top safe-area-bottom'>
            {/* Hero */}

            <div className='flex justify-between items-center mb-6'>
                <motion.div
                    key='game-header'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className='flex w-full items-center gap-4 flex-col text-center'
                >
                    <motion.div
                        key='game-header-image'
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className='flex items-center justify-center'
                    >
                        <img src='pwa-512x512.png' alt='Pombo Nelson Logo' className='w-32 h-32 mt-4 object-contain drop-shadow-[0_0_15px_rgba(255,105,180,0.7)]' />
                    </motion.div>

                    <div>
                        <h1 className='text-4xl font-display font-bold text-foreground'>
                            Group<span className='text-gradient-sincronia'>Games</span>
                        </h1>
                        <p className='text-muted-foreground text-sm'>Sua festa, seus jogos, suas risadas!</p>
                        <div className='mt-5'>
                            <Player.ModalButton />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Games List */}
            <div className='flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {games.map((i) => (
                    <GameCard
                        title={i.item.name}
                        subtitle={i.item.hint}
                        icon={i.icon}
                        route={`/games/${i.route}`}
                        variant={i.variant as GameCardVariant}
                        delay={i.delay}
                        description={i.item.description}
                        key={i.route}
                    />
                ))}
            </div>

            <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className='text-center mt-5 text-xs text-muted-foreground'>
                • Feito com ♥ por Lucas Marrane Siler • 2026 - {new Date().getFullYear()}
            </motion.footer>
        </div>
    );
}
