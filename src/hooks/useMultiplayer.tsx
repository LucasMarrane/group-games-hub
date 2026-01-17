import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useSessionStore } from './useSessionStore';
import { GameProvider } from '@/providers/multiplayer/types';
import { MultiplayerProviderFactory } from '@/providers/multiplayer/factory';

export type GameMode = 'online' | 'local' | 'server';

export interface Player {
    id: string;
    name: string;
    avatar: number;    
    isOffline?: boolean;
    type?: 'host' | 'invited';
}

interface MultiplayerContextType<T> {
    provider: GameProvider<T> | null;
    mode: GameMode;
    setMode: (mode: GameMode) => void;
    isHost: boolean;
    roomId: string | null;
    localPlayerId: string;
    players: Player[];
    gameState: T;
    mainPlayer: string;
    serverConnected: boolean;
    createRoom: () => Promise<string>;
    joinRoom: (roomId: string) => void;
    startGame: (gameState?: string, init?: T) => void;
    addOfflinePlayer: (name: string) => void;
    removePlayer: (playerId: string) => void;
    closeRoom: () => void;
    changeGame: (gameState: any) => void;
    connectToServer: (serverUrl: string) => Promise<void>;
    disconnectFromServer: () => void;
    reconnectToRoom: () => Promise<boolean>;
}

const MultiplayerContext = createContext<MultiplayerContextType<any> | null>(null);

export function useMultiplayer<T extends any>() {
    const context = useContext(MultiplayerContext) as MultiplayerContextType<T>;
    if (!context) {
        throw new Error('useMultiplayer must be used within a MultiplayerProvider');
    }
    return context;
}

interface MultiplayerProviderProps {
    children: React.ReactNode;
    initialMode?: GameMode;
}

export function MultiplayerProvider({ children, initialMode = 'local' }: MultiplayerProviderProps) {
    const { player } = useSessionStore();
    const [mode, setMode] = useState<GameMode>(initialMode);
    const [provider, setProvider] = useState<GameProvider<any> | null>(null);
    const providerRef = useRef<GameProvider<any> | null>(null);

    const localPlayerId = player?.uuid!;

    // Criar novo provedor quando o modo muda
    useEffect(() => {
        if (!localPlayerId) return;

        // Destruir provedor anterior
        if (providerRef.current) {
            providerRef.current.destroy();
        }

        // Criar novo provedor
        const newProvider = MultiplayerProviderFactory.createProvider(mode, localPlayerId);
        newProvider.initialize();
        providerRef.current = newProvider;
        setProvider(newProvider);

        return () => {
            if (newProvider) {
                newProvider.destroy();
            }
        };
    }, [mode, localPlayerId]);

    const handleSetMode = (newMode: GameMode) => {
        setMode(newMode);
    };

    const createRoom = async (): Promise<string> => {
        if (!providerRef.current) {
            toast.error('Provedor não inicializado');
            return Promise.reject('Provider not initialized');
        }
        return providerRef.current.createRoom();
    };

    const joinRoom = (roomId: string) => {
        if (!providerRef.current) {
            toast.error('Provedor não inicializado');
            return;
        }
        providerRef.current.joinRoom(roomId);
    };

    const startGame = (gameState?: string, init?: any) => {
        if (!providerRef.current) {
            toast.error('Provedor não inicializado');
            return;
        }
        providerRef.current.startGame(gameState, init);
    };

    const addOfflinePlayer = (name: string) => {
        if (!providerRef.current) {
            toast.error('Provedor não inicializado');
            return;
        }
        providerRef.current.addOfflinePlayer(name);
    };

    const removePlayer = (playerId: string) => {
        if (!providerRef.current) {
            toast.error('Provedor não inicializado');
            return;
        }
        providerRef.current.removePlayer(playerId);
    };

    const closeRoom = () => {
        if (!providerRef.current) {
            toast.error('Provedor não inicializado');
            return;
        }
        providerRef.current.closeRoom();
    };

    const changeGame = (gameState: any) => {
        if (!providerRef.current) {
            toast.error('Provedor não inicializado');
            return;
        }
        providerRef.current.changeGame(gameState);
    };

    const connectToServer = async (serverUrl: string) => {
        if (!providerRef.current) {
            toast.error('Provedor não inicializado');
            return Promise.reject('Provider not initialized');
        }
        
        // Verificar se o provedor suporta conexão com servidor
        if ('connectToServer' in providerRef.current) {
            return (providerRef.current as any).connectToServer(serverUrl);
        } else {
            toast.error('Este modo não suporta conexão com servidor');
            return Promise.reject('Server connection not supported');
        }
    };

    const disconnectFromServer = () => {
        if (!providerRef.current) {
            toast.error('Provedor não inicializado');
            return;
        }
        
        // Verificar se o provedor suporta desconexão do servidor
        if ('disconnectFromServer' in providerRef.current) {
            (providerRef.current as any).disconnectFromServer();
        }
    };

    // Função de reconexão
    const reconnectToRoom = async (): Promise<boolean> => {
        if (!providerRef.current) {
            toast.error('Provedor não inicializado');
            return Promise.resolve(false);
        }
        
        try {
            return await providerRef.current.reconnectToRoom();
        } catch (error) {
            toast.error('Falha ao reconectar');
            return Promise.resolve(false);
        }
    };

    // Expor propriedades do provedor
    const contextValue = {
        provider,
        mode,
        setMode: handleSetMode,
        isHost: provider?.isHost || false,
        roomId: provider?.roomId || null,
        localPlayerId: provider?.localPlayerId || '',
        players: provider?.players || [],
        gameState: provider?.gameState,
        mainPlayer: provider?.mainPlayer || '',
        serverConnected: (provider as any)?.serverConnected || false,
        createRoom,
        joinRoom,
        startGame,
        addOfflinePlayer,
        removePlayer,
        closeRoom,
        changeGame,
        connectToServer,
        disconnectFromServer,
        reconnectToRoom,
    };

    return (
        <MultiplayerContext.Provider value={contextValue as any}>
            {children} 
        </MultiplayerContext.Provider>
    );
}