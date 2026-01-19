import {  GameProvider } from './GameProvider';
import { GameMode } from './multiplayer.store';
import { Player } from './types';

export class LocalProvider extends GameProvider {
    constructor(mode: GameMode = 'single') {
        super(mode);
    }

    protected createRoom(host: Player) {
        this._multiplayerProvider.createRoom(host, 'local-room');
        this._notify.success('Sala local criada');
    }

    protected joinRoom(player: Player) {
        this._multiplayerProvider.addPlayer(player);
    }

    protected joinConfirmed(players: Player[], roomId: string, playerId: string) {
        this._multiplayerProvider.state.setState({
            roomId,
            isHost: false,
            players,
            localPlayerId: playerId,
        });
    }

    protected addPlayer(player: Player) {
        this._multiplayerProvider.addPlayer(player);
    }

    protected removePlayer(player: Player) {
        this._multiplayerProvider.removePlayer(player);
    }

    protected playerJoined(player: Player) {
        this._notify(`${player.name} entrou na sala`);
    }

    protected playerLeft(player: Player) {
        this._notify(`${player.name} deixou a sala`);
    }

    protected closeRoom(roomId: string) {
        this._multiplayerProvider.closeRoom();
        this._notify(`Sala (${roomId}) fechada`);
    }

    protected kicked(){}

    protected state(state: any) {
        this._multiplayerProvider.gameState(state);
    }
}
