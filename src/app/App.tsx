import { Toaster } from '@shadcn/components/ui/sonner';
import { TooltipProvider } from '@shadcn/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './routes';

import './App.css';
import { OnlineProvider } from '@/hooks/useOnlineStatus';

const queryClient = new QueryClient();

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <OnlineProvider>
                    <AppRoutes />
                </OnlineProvider>
            </TooltipProvider>
        </QueryClientProvider>
    );
};

export default App;
