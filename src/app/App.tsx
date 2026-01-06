import { Toaster } from '@shadcn/components/ui/sonner';
import { TooltipProvider } from '@shadcn/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './routes';

import './App.css'

const queryClient = new QueryClient();

const App = () => {
  
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <AppRoutes />
            </TooltipProvider>
        </QueryClientProvider>
    );
};

export default App;
