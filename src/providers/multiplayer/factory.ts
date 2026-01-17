import { GameProvider } from './types';
import { LocalProvider } from './LocalProvider';
import { OnlineProvider } from './OnlineProvider';
import { ServerProvider } from './ServerProvider';

export class MultiplayerProviderFactory {
    static createProvider<T>(mode: 'local' | 'online' | 'server', localPlayerId: string): GameProvider<T> {
        switch (mode) {
            case 'local':
                return new LocalProvider<T>(localPlayerId);
            case 'online':
                return new OnlineProvider<T>(localPlayerId);
            case 'server':
                return new ServerProvider<T>(localPlayerId);
            default:
                throw new Error(`Unsupported multiplayer mode: ${mode}`);
        }
    }
}