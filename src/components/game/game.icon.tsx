import { GameCardVariant } from '@components/GameCard';
import { games } from '@view/pages/Home';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

export interface IconProps {
    variant: GameCardVariant;
}
export function Icon({ variant }: IconProps) {
    const Icon: LucideIcon = games.find((i) => i.route == variant)?.icon as LucideIcon;
    return (
        <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-20 h-20 mx-auto mb-4 rounded-2xl  gradient-${variant} shadow-glow-${variant}  shadow-glow flex items-center justify-center`}
        >
            <Icon className='w-10 h-10 text-foreground' />
        </motion.div>
    );
}
