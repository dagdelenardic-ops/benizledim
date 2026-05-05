import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            ssr: 'resources/js/ssr.js',
            refresh: true,
        }),
        tailwindcss(),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        VitePWA({
            registerType: 'autoUpdate',
            strategies: 'injectManifest',
            srcDir: 'resources/js',
            filename: 'sw.js',
            injectRegister: false,
            injectManifest: { swSrc: 'resources/js/sw.js', swDest: 'public/build/sw.js' },
            manifest: {
                name: 'Ben/İzledim',
                short_name: 'Ben/İzledim',
                description: 'Film, dizi, belgesel notları',
                start_url: '/yazar',
                scope: '/',
                display: 'standalone',
                theme_color: '#dc2626',
                background_color: '#ffffff',
                lang: 'tr',
                icons: [
                    { src: '/icons/192.png', sizes: '192x192', type: 'image/png' },
                    { src: '/icons/512.png', sizes: '512x512', type: 'image/png' },
                    { src: '/icons/192-maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' }
                ],
                shortcuts: [
                    { name: 'Hızlı Not', url: '/yazar?action=log', icons: [{ src: '/icons/192.png', sizes: '192x192' }] }
                ]
            }
        }),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
