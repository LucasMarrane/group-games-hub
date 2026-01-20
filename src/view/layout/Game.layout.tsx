import { _defaultMultiplayerStore, MultiplayerStore } from '@/providers/multiplayer/multiplayer.store';
import { LayoutProps } from '@appTypes/layout';
import { Button } from '@shadcn/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';

export function GameLayout({ children }: LayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className='min-h-screen min-h-[100dvh] flex flex-col safe-area-top safe-area-bottom'>
            <AnimatePresence mode='wait'>
                {!isHome && (
                    <motion.header
                        initial={{ y: -60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -60, opacity: 0 }}
                        className='sticky top-0 z-50 px-4 py-3 bg-background/80 backdrop-blur-lg border-b border-border/50'
                    >
                        <Button
                            variant='glass'
                            size='sm'
                            onClick={() => {
                                MultiplayerStore.setState(_defaultMultiplayerStore, true);
                                navigate('/');
                            }}
                            className='gap-2'
                        >
                            <ArrowLeft className='w-4 h-4' />
                            <Home className='w-4 h-4' />
                            <span>Menu</span>
                        </Button>
                    </motion.header>
                )}
            </AnimatePresence>

            <main className='flex-1 overflow-y-auto'>
                <AnimatePresence mode='wait'>
                    <motion.div key={location.pathname} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className='h-full'>
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
