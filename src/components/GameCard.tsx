import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { LucideIcon } from 'lucide-react';

export type GameCardVariant = 'sincronia' | 'mimica' | 'palpiteiro' | 'onca' | 'decisoes' | 'caotiqueira' | 'icognito' | 'eununca' | 'detonador' | 'surto';

interface GameCardProps {
    title: string;
    subtitle: string;
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
    icognito: {
        gradient: 'gradient-icognito',
        glow: 'shadow-glow-icognito',
        textGradient: 'text-gradient-icognito',
    },
    eununca: {
        gradient: 'gradient-eununca',
        glow: 'shadow-glow-eununca',
        textGradient: 'text-gradient-eununca',
    },
    detonador: {
        gradient: 'gradient-detonador',
        glow: 'shadow-glow-detonador',
        textGradient: 'text-gradient-detonador',
    },
    surto: {
        gradient: 'gradient-surto',
        glow: 'shadow-glow-surto',
        textGradient: 'text-gradient-surto',
    },
};

export function GameCard({ title, subtitle, icon: Icon, route, variant, delay = 0 }: GameCardProps) {
    const navigate = useNavigate();
    const styles = variantStyles[variant];

    return (
        <motion.button
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay, duration: 0.5, type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(route)}
            className='w-full text-left group'
        >
            <div className={`relative overflow-hidden rounded-2xl p-6 ${styles.gradient} ${styles.glow} transition-all duration-300`}>
                {/* Decorative circles */}
                <div className='absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-xl' />
                <div className='absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-black/10 blur-xl' />

                <div className='relative z-10 flex items-center gap-4'>
                    <motion.div className='w-16 h-16 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center' whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }}>
                        <Icon className='w-8 h-8 text-white' />
                    </motion.div>

                    <div className='flex-1'>
                        <h3 className='text-xl font-display font-bold text-white mb-1'>{title}</h3>
                        <p className='text-sm text-white/80'>{subtitle}</p>
                    </div>

                    <motion.div className='w-10 h-10 rounded-full bg-white/20 flex items-center justify-center' initial={{ x: 0 }} whileHover={{ x: 5 }}>
                        <span className='text-white text-xl'>→</span>
                    </motion.div>
                </div>
            </div>
        </motion.button>
    );
}
