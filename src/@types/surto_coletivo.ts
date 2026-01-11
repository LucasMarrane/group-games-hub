import { IItem } from './game';

export interface SurtoColetivoItem extends IItem {
    description: string;
    action_code: string;
    animation_trigger: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
    footer: string;
    auto_trigger?: boolean;
    trigger_on_death?: boolean;
    affects?: 'player' | 'board';
    duration?: string;
}

export interface SurtoColetivoPlayer {
    id: string;
    name: string;
    isAlive: boolean;
    isZombie: boolean;
    cards: SurtoColetivoItem[];
    activeEffects: SurtoColetivoActiveEffect[];
    isProtected: boolean;
    skipTurns: number;
}

export interface SurtoColetivoActiveEffect {
    id: string;
    cardId: string;
    cardName: string;
    type: 'player' | 'board';
    turnsRemaining: number | 'permanent';
    effect: string;
}

export interface SurtoColetivoBoardCard {
    id: string;
    card: SurtoColetivoItem;
    playerId: string;
    turnsRemaining?: number;
}

export interface SurtoColetivoGameState {
    players: SurtoColetivoPlayer[];
    currentPlayerIndex: number;
    deck: SurtoColetivoItem[];
    discardPile: SurtoColetivoItem[];
    boardCards: SurtoColetivoBoardCard[];
    direction: 1 | -1;
    phase: 'setup' | 'lobby' | 'playing' | 'paused' | 'ended';
    winner: SurtoColetivoPlayer | null;
    lastAction: {
        playerId: string;
        playerName: string;
        action: string;
        card?: SurtoColetivoItem;
        target?: string;
    } | null;
    turnPhase: 'draw' | 'play' | 'end';
    actionsThisTurn: number;
    silenceMode: boolean;
    slowMotionTurns: number;
    truceActive: boolean;
}

export type SurtoColetivoGameAction =
    | { type: 'DRAW_CARD'; playerId: string }
    | { type: 'PLAY_CARD'; playerId: string; cardId: string; targetId?: string }
    | { type: 'DISCARD_CARD'; playerId: string; cardId: string }
    | { type: 'END_TURN'; playerId: string }
    | { type: 'ELIMINATE_PLAYER'; playerId: string; reason: string }
    | { type: 'REVIVE_PLAYER'; playerId: string; asZombie: boolean }
    | { type: 'REVERSE_DIRECTION' }
    | { type: 'SKIP_PLAYER'; playerId: string; turns: number }
    | { type: 'ADD_BOARD_CARD'; card: SurtoColetivoItem; playerId: string; duration?: number }
    | { type: 'REMOVE_BOARD_CARD'; cardId: string }
    | { type: 'SHUFFLE_HANDS' }
    | { type: 'PASS_CARDS_LEFT' }
    | { type: 'PASS_CARDS_RIGHT' }
    | { type: 'START_GAME' }
    | { type: 'END_GAME'; winnerId: string };
