import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'robots.txt'],
            manifest: {
                name: 'GroupGames - Party Games Hub',
                short_name: 'GroupGames',
                description: 'Sua festa, seus jogos, suas risadas!',
                theme_color: '#14111f',
                background_color: '#14111f',
                display: 'standalone',
                orientation: 'portrait',
                start_url: '/',
                icons: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
            },
        }),
    ],
    resolve: {
        alias: {
            '@view': path.resolve(__dirname, './src/view'),
            '@components': path.resolve(__dirname, './src/components'),
            '@shadcn': path.resolve(__dirname, './src/@shadcn'),
            '@appTypes': path.resolve(__dirname, './src/@types'),
            '@data': path.resolve(__dirname, './src/data'),
            '@': path.resolve(__dirname, './src'),
        },
    },
}));
