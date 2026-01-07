import { ILabel } from '@appTypes/game';
import { cn } from '@shadcn/lib/utils';

interface CategoryProps {
    selected: string | 'all';
    onSelect: (category: string | 'all') => void;
    itens: ILabel<any>[];
}
export function Category({ selected, onSelect, itens = [] }: CategoryProps) {
    const allItens = [{ label: 'Todos', value: 'all' }, ...itens];
    return (
        <div className='flex gap-2 overflow-x-auto flex-wrap w-full pb-2 scrollbar-hide'>
            {allItens.map((category) => (
                <button
                    key={category.value}
                    onClick={() => onSelect(category.value)}
                    className={cn(
                        'px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200',
                        selected === category.value ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:bg-muted/80',
                    )}
                >
                    {category.label}
                </button>
            ))}
        </div>
    );
}
