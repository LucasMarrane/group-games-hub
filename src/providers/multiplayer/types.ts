export interface Player {
    id: string;
    name: string;
    isOffline?: boolean;
    type?: 'host' | 'invited';
    avatar: number;
    metadata?: any;
    connection?: any;
}
