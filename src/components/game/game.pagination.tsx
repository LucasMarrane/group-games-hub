import { Button } from '@shadcn/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
    page: number;
    totalPages: number;
    setPage: Function;
}
export function Pagination({ page, totalPages, setPage }: PaginationProps) {
    return (
        <div className='flex items-center justify-end px-4 py-4'>
            <div className='flex w-full items-center gap-8 lg:w-fit'>
                <div className='flex w-fit items-center justify-center text-sm font-medium'>
                    Página {page} de {totalPages}
                </div>
                <div className='ml-auto flex items-center gap-2 lg:ml-0'>
                    <Button
                        variant='outline'
                        className='hidden h-8 w-8 p-0 lg:flex'
                        onClick={() => {
                            setPage(1);
                        }}
                        disabled={page == 1}
                    >
                        <span className='sr-only'>Primeira página</span>
                        <ChevronsLeft />
                    </Button>
                    <Button
                        variant='outline'
                        className='size-8'
                        size='icon'
                        onClick={() => {
                            setPage(page - 1 );
                        }}
                        disabled={page == 1}
                    >
                        <span className='sr-only'>Página anterior</span>
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant='outline'
                        className='size-8'
                        size='icon'
                        onClick={() => {
                            setPage(page + 1);
                        }}
                        disabled={page == totalPages}
                    >
                        <span className='sr-only'>Próxima página</span>
                        <ChevronRight />
                    </Button>
                    <Button
                        variant='outline'
                        className='hidden size-8 lg:flex'
                        size='icon'
                        onClick={() => {
                            setPage(totalPages);
                        }}
                        disabled={page == totalPages}
                    >
                        <span className='sr-only'>Última página</span>
                        <ChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    );
}
