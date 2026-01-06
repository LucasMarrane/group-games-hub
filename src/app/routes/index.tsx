import { GameLayout } from '@view/layout/Game.layout';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router';

const Home = lazy(() => import('@view/pages/Home'));
const NotFound = lazy(() => import('@view/pages/NotFound'));

const Sincronia = lazy(() => import('@games/SincroniaGame'));
const Mimica = lazy(() => import('@games/MimicaGame'));
const NemAPau = lazy(() => import('@games/NemAPauGame'));

export function AppRoutes() {
    return (
        <Suspense>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route
                        path='/games'
                        element={
                            <GameLayout>
                                <Outlet />
                            </GameLayout>
                        }
                    >
                        <Route path='sincronia' element={<Sincronia />} />
                        <Route path='mimica' element={<Mimica />} />
                        <Route path='nem_a_pau' element={<NemAPau />} />
                    </Route>
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </Suspense>
    );
}
