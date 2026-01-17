import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { toast } from 'sonner';
import { useSessionStore } from './useSessionStore';

export interface Player {
    id: string;
    name: string;
    avatar: number;
    connection?: DataConnection;
    isOffline?: boolean;
    type?: 'host' | 'invited';
}

export type GameMode = 'online' | 'local';

interface MultiplayerContextType<T> {
    peer: Peer | null;
    connections: DataConnection[];
    isHost: boolean;
    roomId: string | null;
    localPlayerId: string;
    players: Player[];
    gameState: T;
    mode: GameMode;
    mainPlayer: string;
    setMode: (mode: GameMode) => void;
    createRoom: () => Promise<string>;
    joinRoom: (roomId: string) => void;
    startGame: (gameState?: string, init?: T) => void;
    addOfflinePlayer: (name: string) => void;
    removePlayer: (playerId: string) => void;
    closeRoom: () => void;
    changeGame: (gameState: any) => void;
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

    const [peer, setPeer] = useState<Peer | null>(null);
    const [connections, setConnections] = useState<DataConnection[]>([]);
    const [isHost, setIsHost] = useState(false);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [gameState, setGameState] = useState<any>();

    const [mainPlayer, setMainPlayer] = useState<string>('');

    const peerRef = useRef<Peer | null>(null);
    const connectionsRef = useRef<DataConnection[]>([]);
    const playersRef = useRef<Player[]>([]);

    const localPlayerId = player?.uuid!;

    const resetGameContext = () => {
        setIsHost(false);
        setRoomId(null);
        setPlayers([]);
        playersRef.current = [];
        setGameState(null);
        setConnections([]);
        connectionsRef.current = [];
    };

    useEffect(() => {
        if (mode === 'local') {
            if (peerRef.current) {
                peerRef.current.destroy();
                peerRef.current = null;
                setPeer(null);
                setConnections([]);
                connectionsRef.current = [];
            }
            return;
        }

        if (mode === 'online' && !peerRef.current) {
            const newPeer = new Peer();
            peerRef.current = newPeer;
            setPeer(newPeer);

            newPeer.on('open', (id) => console.log('My peer ID is: ' + id));
            newPeer.on('connection', (conn) => handleNewConnection(conn));
            newPeer.on('error', (err) => toast.error('Erro de conexão: ' + err.message));

            return () => {
                if (newPeer) newPeer.destroy();
            };
        }
    }, [mode]);

    const handleNewConnection = (conn: DataConnection) => {
        connectionsRef.current = [...connectionsRef.current, conn];
        setConnections([...connectionsRef.current]);

        conn.on('data', (data) => handleIncomingData(data, conn));

        conn.on('close', () => {
            connectionsRef.current = connectionsRef.current.filter((c) => c !== conn);
            setConnections(connectionsRef.current);

            const playerToRemove = playersRef.current.find((p) => p.connection === conn);
            if (playerToRemove) {
                playersRef.current = playersRef.current.filter((p) => p.connection !== conn);
                setPlayers([...playersRef.current]); // Force update

                toast.info(`${playerToRemove.name} saiu da sala`);

                if (isHost) {
                    broadcastMessage({
                        type: 'PLAYER_LEFT',
                        playerId: playerToRemove.id,
                    });
                }
            }
        });
    };

    const handleIncomingData = (data: any, conn: DataConnection) => {
        try {
            const message = JSON.parse(data);

            switch (message.type) {
                case 'JOIN_REQUEST':
                    const newPlayer: Player = {
                        id: message.playerId,
                        name: message.playerName || `Jogador ${playersRef.current.length + 1}`,
                        avatar: message.avatar ||  Math.floor(Math.random() * 120) + 1,
                        connection: conn,
                        isOffline: false,
                    };
                    playersRef.current = [...playersRef.current, newPlayer];
                    setPlayers(playersRef.current);
                    toast.success(`${newPlayer.name} entrou na sala`);

                    conn.send(
                        JSON.stringify({
                            type: 'JOIN_CONFIRMED',
                            playerId: newPlayer.id,
                            isHost: false,
                            roomId: roomId,
                            players: playersRef.current.map((p) => ({ id: p.id, name: p.name, avatar: p.avatar, type: p?.type ?? 'invited' })),
                        }),
                    );

                    broadcastMessage(
                        {
                            type: 'PLAYER_JOINED',
                            player: { id: newPlayer.id, name: newPlayer.name },
                        },
                        conn,
                    );
                    break;

                case 'JOIN_CONFIRMED':
                    setIsHost(message.isHost);
                    setRoomId(message.roomId);
                    const updatedPlayers = message.players.map((p: any) => p);
                    playersRef.current = updatedPlayers;
                    setPlayers(updatedPlayers);
                    toast.success('Conectado à sala!');
                    break;

                case 'PLAYER_JOINED':
                    if (!playersRef.current.some((p) => p.id === message.player.id)) {
                        playersRef.current = [...playersRef.current, message.player];
                        setPlayers([...playersRef.current]);
                        toast.success(`${message.player.name} entrou na sala`);
                    }
                    break;

                case 'PLAYER_LEFT':
                    playersRef.current = playersRef.current.filter((p) => p.id !== message.playerId);
                    setPlayers([...playersRef.current]);

                    break;

                case 'KICKED':
                    toast.error('Você foi removido da sala pelo Host.');
                    resetGameContext();

                    break;

                case 'ROOM_CLOSED':
                    toast.warning('O Host encerrou a sala.');
                    resetGameContext();
                    break;

                case 'START_GAME':
                    setGameState(message.gameState);
                    toast.success('Jogo iniciado!');
                    break;

                case 'PLAYER_ANSWER':
                    setGameState((prev: any) => ({
                        ...prev,
                        answers: { ...prev?.answers, [message.playerId]: message.answer },
                    }));
                    break;

                case 'SUBMIT_VOTE':
                    setGameState((prev: any) => ({
                        ...prev,
                        votes: { ...prev?.votes, [message.voterId]: message.votedPlayerId },
                    }));
                    break;
                case 'CHANGE_GAME':
                    setGameState((prev: any) => ({
                        ...prev,
                        ...(message?.gameState ?? {}),
                    }));
                    break;

                case 'MAIN_PLAYER': {
                    const actual = players.findIndex((i) => i.id == mainPlayer);
                    const newMainPlayerIndex = actual >= players.length - 1 ? 0 : actual + 1;
                    setMainPlayer(players[newMainPlayerIndex].id);
                    break;
                }
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    };

    const broadcastMessage = (message: any, excludeConn?: DataConnection) => {
        if (mode === 'local') return;
        const messageStr = JSON.stringify(message);
        connectionsRef.current.forEach((conn) => {
            if (conn !== excludeConn && conn.open) {
                conn.send(messageStr);
            }
        });
    };

    const createRoom = async (): Promise<string> => {
        resetGameContext();
        const _defaultHost = { id: localPlayerId, name: `${player?.nickname} (Host)`, type: 'host', avatar: player?.avatar } as Player;
        setMainPlayer(localPlayerId);
        if (mode === 'local') {
            setIsHost(true);
            setRoomId('local-room');
            const localPlayer: Player = { ..._defaultHost, isOffline: true };
            playersRef.current = [localPlayer];
            setPlayers([localPlayer]);

            return Promise.resolve('local-room');
        }

        return new Promise((resolve, reject) => {
            if (!peerRef.current) {
                reject(new Error('Peer not initialized'));
                return;
            }
            const id = peerRef.current.id;
            const setupHost = (hostId: string) => {
                setIsHost(true);
                setRoomId(hostId);
                const localPlayer: Player = { ..._defaultHost, isOffline: false };
                playersRef.current = [localPlayer];
                setPlayers([localPlayer]);

                resolve(hostId);
            };

            if (id) setupHost(id);
            else {
                peerRef.current.on('open', (newId) => setupHost(newId));
                peerRef.current.on('error', (err) => reject(err));
            }
        });
    };

    const closeRoom = () => {
        if (!isHost) {
            removePlayer(localPlayerId);
            return;
        }

        if (isHost) {
            if (mode === 'online') {
                broadcastMessage({ type: 'ROOM_CLOSED' });

                setTimeout(() => {
                    connectionsRef.current.forEach((conn) => conn.close());
                    resetGameContext();
                }, 100);
            } else {
                resetGameContext();
            }

            toast.success('Sala encerrada.');
        }
    };

    const addOfflinePlayer = (name: string) => {
        const newPlayerId = Math.random().toString(36).substring(2, 10);
        const newPlayer: Player = {
            id: newPlayerId,
            name: name,
            avatar: Math.floor(Math.random() * 120) + 1,
            isOffline: true,
        };
        playersRef.current = [...playersRef.current, newPlayer];
        setPlayers([...playersRef.current]);
        toast.success(`${name} adicionado!`);

        if (mode === 'online') {
            broadcastMessage({
                type: 'PLAYER_JOINED',
                player: { id: newPlayer.id, name: newPlayer.name,  },
            });
        }
    };

    const removePlayer = (playerId: string) => {
        if (!isHost) return;
        if (playerId === localPlayerId) return;

        const playerToRemove = playersRef.current.find((p) => p.id === playerId);
        if (!playerToRemove) return;

        if (mode === 'local' || playerToRemove.isOffline) {
            playersRef.current = playersRef.current.filter((p) => p.id !== playerId);
            setPlayers([...playersRef.current]);
            toast.info(`${playerToRemove.name} removido.`);
            if (mode === 'online') {
                broadcastMessage({ type: 'PLAYER_LEFT', playerId });
            }
            return;
        }

        if (playerToRemove.connection) {
            playerToRemove.connection.send(JSON.stringify({ type: 'KICKED' }));
            setTimeout(() => {
                playerToRemove.connection?.close();
            }, 100);
        }
    };

    const joinRoom = (targetRoomId: string) => {
        if (mode === 'local') return;
        if (!peerRef.current) {
            toast.error('Erro: Conexão online não ativa');
            return;
        }
        try {
            const conn = peerRef.current.connect(targetRoomId);
            handleNewConnection(conn);
            conn.on('open', () => {
                conn.send(
                    JSON.stringify({
                        type: 'JOIN_REQUEST',
                        playerId: localPlayerId,
                        playerName: player?.nickname,
                        avatar: player?.avatar
                    }),
                );
            });
        } catch (error) {
            toast.error('Erro ao conectar à sala');
        }
    };

    const startGame = (gameState: string = 'setup', initGameState = {}) => {
        if (!isHost) {
            toast.error('Apenas o host pode iniciar o jogo');
            return;
        }
        const initialGameState = {
            phase: gameState,
            players: playersRef.current.map((p) => p.id),
            currentCardIndex: 0,
            currentQuestionIndex: 0,
            showAnswer: false,
            shuffledCards: [],
            answers: {},
            votes: {},
            ...initGameState,
        };
        setGameState(initialGameState);
        if (mode === 'online') {
            broadcastMessage({ type: 'START_GAME', gameState: initialGameState });
        }
        toast.success('Jogo iniciado!');
    };

    const changeGame = (gameState: any) => {
        setGameState(gameState);
        if (mode === 'online') {
            broadcastMessage({ type: 'CHANGE_GAME', gameState });
        }
    };    

    return (
        <MultiplayerContext.Provider
            value={{
                peer,
                connections,
                isHost,
                roomId,
                localPlayerId,
                players,
                gameState,
                mode,
                mainPlayer,
                setMode,
                createRoom,
                joinRoom,
                startGame,
                addOfflinePlayer,
                removePlayer,
                closeRoom,
                changeGame,
            }}
        >
            {children}
        </MultiplayerContext.Provider>
    );
}
