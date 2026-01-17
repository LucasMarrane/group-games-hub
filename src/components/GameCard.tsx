import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { BookOpen, LucideIcon, Play } from 'lucide-react';
import { Button } from '@shadcn/components/ui/button';
import * as Game from '@components/game';
import { IGameRule } from '@appTypes/game';

export type GameCardVariant = 'sincronia' | 'mimica' | 'palpiteiro' | 'onca' | 'decisoes' | 'caotiqueira';

interface GameCardProps {
    title: string;
    subtitle: string;
    description: string;
    icon: LucideIcon;
    route: string;
    variant: GameCardVariant;
    delay?: number;
    rule: IGameRule;
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

export function GameCard({ title, subtitle, description, icon: Icon, route, variant, rule, delay = 0 }: GameCardProps) {
    const navigate = useNavigate();
    const styles = variantStyles[variant];

    return (
        <motion.div
            key={`game-card-${route}`}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay, duration: 0.5, type: 'spring', stiffness: 100 }}
            whileHover={{ y: -5 }}
            className='h-full'
        >
            <div className={`relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 h-full flex flex-col`}>
                {/* Header with gradient */}
                <div className={`${styles.gradient} ${styles.glow} p-5 pb-12 relative`}>
                    <div className='absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-xl' />
                    <div className='absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-black/10 blur-xl' />

                    <div className='relative z-10 flex items-start gap-4'>
                        <motion.div
                            className='w-16 h-16 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0'
                            whileHover={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 0.5 }}
                        >
                            <Icon className='w-8 h-8 text-white' />
                        </motion.div>

                        <div className='flex-1 min-w-0'>
                            <h3 className='text-xl font-display font-bold text-white mb-1 truncate'>{title}</h3>
                            <p className='text-sm text-white/90 line-clamp-2'>{subtitle}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className='p-5 flex-1 flex flex-col justify-between'>
                    <p className='text-sm text-muted-foreground mb-4 flex-1'>{description}</p>

                    <div className='p-5 flex-1 flex items-end  max-md:flex-col '>
                        <Button onClick={() => navigate(route)} className={`${styles.gradient} hover:opacity-90 text-primary-foreground border-0 w-full`} size='sm'>
                            <Play className='w-4 h-4 mr-1' /> Jogar
                        </Button>
                        <Game.Rules
                            gameName={title}
                            rule={rule}
                            description={description}
                            trigger={
                                <Button variant='outline' className='bg-white/10 border-white/20 text-white hover:bg-white/20 min-md:ml-2 max-md:mt-2 max-md:w-full' size='sm'>
                                    <BookOpen className='w-4 h-4' />
                                    <span className='min-md:hidden invisible max-md:visible'>Regras</span>
                                </Button>
                            }
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
