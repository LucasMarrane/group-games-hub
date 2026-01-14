interface SpriteAvatarProps {
    spriteUrl?: string;
    avatarSize?: number;
    index?: number;
    columns?: number;
    scale?: number;
}

export function SpriteAvatar({ spriteUrl = 'default_nelson.webp', avatarSize = 408.6, index = 0, columns = 5, scale = 0.3 }: SpriteAvatarProps){
    const col = index % columns;
    const row = Math.floor(index / columns);

    const xPos = -(col * avatarSize);
    const yPos = -(row * avatarSize);

   
    const style: React.CSSProperties = {
        backgroundImage: `url(${spriteUrl})`,
        backgroundPosition: `${xPos}px ${yPos}px`,
        width: `${avatarSize}px`,
        height: `${avatarSize}px`,
        backgroundRepeat: 'no-repeat',
       
        borderRadius: '50%',
        transform: `scale(${scale})`, 
        display: 'inline-block',
        border: '2px solid #fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    };

    return (
        <div style={{ boxSizing: 'border-box' }}>
            <div style={style} aria-label={`Avatar ${index}`} role='img' />
        </div>
    );
};
