import { GameCard } from '@components/GameCard';
import { motion } from 'framer-motion';
import { Sparkles, Users, Target, Bird } from 'lucide-react';

export default function Home() {
    return (
        <div className='min-h-screen min-h-[100dvh] p-6 flex flex-col safe-area-top safe-area-bottom'>
            {/* Hero */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className='text-center mb-8 mt-8'>
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
            </motion.div>

            {/* Games List */}
            <div className='flex-1 space-y-4'>
                <GameCard title='ITO (Sincronia)' subtitle='Ordene números em equipe' icon={Target} route='/games/ito' variant='sincronia' delay={0.3} />

                <GameCard title='Mímica' subtitle='Represente e adivinhe para pontuar' icon={Users} route='/games/mimica' variant='mimica' delay={0.4} />

                <GameCard title='Nem a Pato' subtitle='Trivia numérica' icon={Bird} route='/games/pato' variant='pato' delay={0.5} />
            </div>

            {/* Footer */}
            <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className='text-center mt-6 text-xs text-muted-foreground'>
                Toque em um jogo para começar • Feito com ♥ por Lucas Marrane Siler • 2026 - {new Date().getFullYear()}
            </motion.footer>
        </div>
    );
}
