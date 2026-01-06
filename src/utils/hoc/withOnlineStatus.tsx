import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function withOnlineStatus<P>(Component: React.ComponentType<P>) {
    return (props: P) => {
        const { isOnline } = useOnlineStatus();

        if (!isOnline) return null;
        return <Component {...(props as any)} />;
    };
}
