import { Player } from '@/providers/multiplayer/types';
import { SessionStore } from '../entities/session';

export function leftFillNum(num: number, targetLength: number) {
    return num?.toString().padStart(targetLength, '0');
}

export class PlayerManager {
    static async createPlayer(nickname: string, avatar: number, uuid?: string) {
        SessionStore.setState({
            player: {
                nickname,
                uuid: uuid || this.randomId,
                avatar,
            },
        });
    }

    static getAvatarUrl(id: number) {
        const path = import.meta.env.BASE_URL.replaceAll('/', '');
        return `${path ? `/${path}` : ''}/sprites/nelson${leftFillNum(id, 3)}.webp`;
    }

    static getAvatarFallback(name: string) {
        const partes = (name ?? '')
            ?.normalize('NFD')
            ?.replace(/[\u0300-\u036f]/g, '')
            ?.trim()
            ?.split(/\s+/);

        if (partes.length === 0) return '';

        const primeiraLetra = partes[0][0];
        const ultimaLetra = partes.length > 1 ? partes[partes.length - 1][0] : '';

        return (primeiraLetra + ultimaLetra).toUpperCase();
    }
    static get randomId() {
        return Math.random().toString(36).substring(2, 10);
    }

    static get randomAvatar() {
        return Math.floor(Math.random() * 120) + 1;
    }

    static randomPlayer(name: string): Player {
        return { avatar: this.randomAvatar, id: this.randomId, name, isOffline: true, type: 'invited' };
    }
}
