import { SessionStore } from '../entities/session';

export class PlayerManager {
    static async createPlayer(nickname: string) {
        SessionStore.setState({
            player: {
                nickname,
                uuid: Math.random().toString(36).substring(2, 10),
            },
        });
    }

    static getAvatar(name: string) {
        const partes = name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim()
            .split(/\s+/);

        if (partes.length === 0) return '';

        const primeiraLetra = partes[0][0];
        const ultimaLetra = partes.length > 1 ? partes[partes.length - 1][0] : '';

        return (primeiraLetra + ultimaLetra).toUpperCase();
    }
}
