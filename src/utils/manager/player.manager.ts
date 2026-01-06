import { SupabaseClient } from '@/utils/db/supabase';
import { Tables } from '@appTypes/database.types';
import { SessionStore } from '../entities/session';

export class PlayerManager {
    static async createPlayer({ name, nickname, email}: Pick<Tables<'players'>, 'name' | 'nickname' | 'email'>) {
        const table = SupabaseClient.from('players');
        let player = await table.select('*').eq('email', email!);
        if (!player?.data?.length) player = await table.insert({ name, nickname, email }).select();
        else player = await table.update({ name, nickname }).eq('email', email!).select();

        SessionStore.setState({ player: player?.data?.[0] });
    }

    static getNickname(name: string) {
        return name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '.');
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
