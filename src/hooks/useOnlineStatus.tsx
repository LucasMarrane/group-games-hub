import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { onlineManager } from '@tanstack/react-query';

type OnlineContextType = {
    isOnline: boolean;
};

const OnlineContext = createContext<OnlineContextType | undefined>(undefined);

type OnlineProviderProps = {
    children: ReactNode;
};

export function OnlineProvider({ children }: OnlineProviderProps) {
    const [isOnline, setIsOnline] = useState(onlineManager.isOnline());

    useEffect(() => {
        const unsubscribe = onlineManager.subscribe(() => {
            setIsOnline(onlineManager.isOnline());
        });

        return unsubscribe;
    }, []);

    return <OnlineContext.Provider value={{ isOnline }}>{children}</OnlineContext.Provider>;
}

export function useOnlineStatus() {
    const context = useContext(OnlineContext);

    if (!context) {
        throw new Error('useOnline deve ser usado dentro de OnlineProvider');
    }

    return context;
}
