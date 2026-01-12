import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { LucideIcon, Play } from 'lucide-react';
import { Button } from '@shadcn/components/ui/button';

export type GameCardVariant = 'sincronia' | 'mimica' | 'palpiteiro' | 'onca' | 'decisoes' | 'caotiqueira';

interface GameCardProps {
    title: string;
    subtitle: string;
    description: string;
    icon: LucideIcon;
    route: string;
    variant: GameCardVariant;
    delay?: number;
}

const variantStyles = {
    sincronia: {
        gradient: 'gradient-sincronia',
        glow: 'shadow-glow-sincronia',
        textGradient: 'text-gradient-sincronia',
    },
    mimica: {
        gradient: 'gradient-mimica',
        glow: 'shadow-glow-mimica',
        textGradient: 'text-gradient-mimica',
    },
    palpiteiro: {
        gradient: 'gradient-palpiteiro',
        glow: 'shadow-glow-palpiteiro',
        textGradient: 'text-gradient-palpiteiro',
    },
    onca: {
        gradient: 'gradient-onca',
        glow: 'shadow-glow-onca',
        textGradient: 'text-gradient-onca',
    },
    decisoes: {
        gradient: 'gradient-decisoes',
        glow: 'shadow-glow-decisoes',
        textGradient: 'text-gradient-decisoes',
    },
    caotiqueira: {
        gradient: 'gradient-caotiqueira',
        glow: 'shadow-glow-caotiqueira',
        textGradient: 'text-gradient-caotiqueira',
    },
};

export function GameCard({ title, subtitle, description, icon: Icon, route, variant, delay = 0 }: GameCardProps) {
    const navigate = useNavigate();
    const styles = variantStyles[variant];

    return (
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay, duration: 0.5, type: 'spring', stiffness: 100 }} className='w-full'>
            <div className={`relative overflow-hidden rounded-2xl p-6 ${styles.gradient} ${styles.glow} transition-all duration-300 h-full`}>
                {/* Decorative circles */}
                <div className='absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-xl' />
                <div className='absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-black/10 blur-xl' />

                <div className='relative z-10 flex flex-col h-full'>
                    <div className='flex items-start gap-4 mb-4'>
                        <motion.div
                            className='w-16 h-16 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0'
                            whileHover={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 0.5 }}
                        >
                            <Icon className='w-8 h-8 text-white' />
                        </motion.div>

                        <div className='flex-1 min-w-0'>
                            <h3 className='text-xl font-display font-bold text-white mb-1 truncate'>{title}</h3>
                            <p className='text-sm text-white/80 line-clamp-2'>{subtitle}</p>
                        </div>
                    </div>

                    <p className='text-xs text-white/70 mb-4 line-clamp-2 flex-1'>{description}</p>

                    <div className='flex gap-2'>
                        <Button onClick={() => navigate(route)} className='flex-1 bg-white/20 hover:bg-white/30 text-white border-0' size='sm'>
                            <Play className='w-4 h-4 mr-1' />
                            Jogar
                        </Button>
                        {/* <Button variant='outline' className='bg-white/10 border-white/20 text-white hover:bg-white/20' size='sm'>
                            <BookOpen className='w-4 h-4' />
                        </Button> */}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
