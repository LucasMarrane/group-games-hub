import { GameCard, GameCardVariant } from '@components/GameCard';
import { CaotiqueiraGame } from '@data/caotiqueira/theme';
import { DecisoesGame } from '@data/decisoes/theme';
import { MimicaGame, PalpiteiroGame, SincroniaGame } from '@data/index';
import { OncaGame } from '@data/onca/theme';
import { SurtoColetivoGame } from '@data/surto_coletivo/theme';

import { motion } from 'framer-motion';
import { Sparkles, Users, Target, Bird, Cat, Skull, Zap, Goal } from 'lucide-react';

export const games = [
    { route: 'sincronia', variant: 'sincronia', delay: 0.3, item: SincroniaGame, icon: Target },
    { route: 'mimica', variant: 'mimica', delay: 0.4, item: MimicaGame, icon: Users },
    { route: 'palpiteiro', variant: 'palpiteiro', delay: 0.5, item: PalpiteiroGame, icon: Bird },
    { route: 'onca', variant: 'onca', delay: 0.6, item: OncaGame, icon: Cat },
    { route: 'decisoes', variant: 'decisoes', delay: 0.7, item: DecisoesGame, icon: Skull },
    { route: 'caotiqueira', variant: 'caotiqueira', delay: 0.8, item: CaotiqueiraGame, icon: Zap },
    { route: 'surto', variant: 'surto', delay: 0.8, item: SurtoColetivoGame, icon: Goal },
];

export default function Home() {
    return (
        <div className='min-h-screen max-h-[100dvh] p-6 flex flex-col safe-area-top safe-area-bottom'>
            {/* Hero */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className='text-center mb-8 mt-8 flex flex-col justify-center'>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className='w-20 h-20 mx-auto mb-4 rounded-2xl gradient-sincronia shadow-glow-sincronia flex items-center justify-center'
                >
                    <Sparkles className='w-10 h-10 text-white' />
                </motion.div>

                <h1 className='text-4xl font-display font-bold text-foreground mb-2'>
                    Group<span className='text-gradient-sincronia'>Games</span>
                </h1>
                <p className='text-muted-foreground'>Sua festa, seus jogos, suas risadas!</p>
                <p className='text-muted-foreground'> Toque em um jogo para começar</p>

                <div className='flex w-full justify-center mt-2'>{/* <Player.ModalButton /> */}</div>
            </motion.div>

            {/* Games List */}
            <div className='flex-1 space-y-4'>
                {games.map((i) => (
                    <GameCard title={i.item.name} subtitle={i.item.hint} icon={i.icon} route={`/games/${i.route}`} variant={i.variant as GameCardVariant} delay={i.delay} />
                ))}
            </div>

            <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className='text-center mt-5 text-xs text-muted-foreground'>
                • Feito com ♥ por Lucas Marrane Siler • 2026 - {new Date().getFullYear()}
            </motion.footer>
        </div>
    );
}
