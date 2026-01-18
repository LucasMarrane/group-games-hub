import { GameProvider } from './GameProvider';
import { LocalProvider } from './LocalProvider';
import { GameMode } from './multiplayer.store';
import { OnlineProvider } from './OnlineProvider';
import { ServerProvider } from './ServerProvider';

export class MultiplayerProviderFactory {
    static createProvider(mode: GameMode): GameProvider {
        switch (mode) {
            case 'single':
                return new LocalProvider();
            case 'local':
                return new LocalProvider('local');
            case 'online':
                return new OnlineProvider();
            case 'server':
                return new ServerProvider();
            default:
                throw new Error(`Unsupported multiplayer mode: ${mode}`);
        }
    }
}
