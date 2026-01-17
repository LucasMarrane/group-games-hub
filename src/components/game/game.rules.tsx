import { IGameRule } from '@appTypes/game';
import { Button } from '@shadcn/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shadcn/components/ui/dialog';
import { BookOpen } from 'lucide-react';
import { ReactNode } from 'react';

interface RulesModalProps {
    gameName: string;
    description: string;
    onOpenChange?: (open: boolean) => void;
    trigger?: ReactNode;
    rule: IGameRule;
}

export function Rules({ gameName, rule, onOpenChange, trigger, description }: RulesModalProps) {
    return (
        <Dialog onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant='outline' size='sm' className='gap-2'>
                        <BookOpen className='w-4 h-4' />
                        Regras
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className='max-w-md md:max-w-lg'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <BookOpen className='w-5 h-5 text-primary' />
                        Regras do {gameName}
                    </DialogTitle>
                </DialogHeader>
                <div className='max-h-[60vh] overflow-y-auto pr-2'>
                    <p className='text-foreground whitespace-pre-line'>
                        {description} <br />
                        <br />
                    </p>
                    <p className='text-foreground whitespace-pre-line'>
                        <b>Objetivo:</b> {rule.goal} <br />
                        <br />
                    </p>
                    <p className='text-foreground whitespace-pre-line mt-2'>
                        <b>Como jogar:</b> <br /> {rule.howToPlay}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
