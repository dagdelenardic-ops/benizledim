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
                id: '/',
                name: 'Ben/İzledim',
                short_name: 'Benİzledim',
                description: 'Film, dizi ve belgesel eleştiri platformu. İzlediklerini puanla, not al, keşfet.',
                start_url: '/',
                scope: '/',
                display: 'standalone',
                display_override: ['standalone', 'minimal-ui'],
                orientation: 'any',
                theme_color: '#dc2626',
                background_color: '#ffffff',
                lang: 'tr',
                dir: 'ltr',
                categories: ['entertainment', 'news', 'social'],
                icons: [
                    { src: '/icons/48.png', sizes: '48x48', type: 'image/png', purpose: 'any' },
                    { src: '/icons/72.png', sizes: '72x72', type: 'image/png', purpose: 'any' },
                    { src: '/icons/96.png', sizes: '96x96', type: 'image/png', purpose: 'any' },
                    { src: '/icons/128.png', sizes: '128x128', type: 'image/png', purpose: 'any' },
                    { src: '/icons/144.png', sizes: '144x144', type: 'image/png', purpose: 'any' },
                    { src: '/icons/152.png', sizes: '152x152', type: 'image/png', purpose: 'any' },
                    { src: '/icons/192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
                    { src: '/icons/384.png', sizes: '384x384', type: 'image/png', purpose: 'any' },
                    { src: '/icons/512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
                    { src: '/icons/192-maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
                    { src: '/icons/512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
                ],
                screenshots: [
                    { src: '/icons/screenshot-narrow.png', sizes: '540x960', type: 'image/png', form_factor: 'narrow', label: 'Ana sayfa' },
                    { src: '/icons/screenshot-wide.png', sizes: '1280x720', type: 'image/png', form_factor: 'wide', label: 'Ana sayfa - tablet' }
                ],
                shortcuts: [
                    { name: 'Hızlı Not', short_name: 'Not', url: '/?action=log', icons: [{ src: '/icons/96.png', sizes: '96x96' }] },
                    { name: 'Ne İzlesem?', short_name: 'Öneri', url: '/ne-izlesem', icons: [{ src: '/icons/96.png', sizes: '96x96' }] },
                    { name: 'Haberler', short_name: 'Haber', url: '/haberler', icons: [{ src: '/icons/96.png', sizes: '96x96' }] },
                    { name: 'Quiz', short_name: 'Quiz', url: '/quiz', icons: [{ src: '/icons/96.png', sizes: '96x96' }] }
                ],
                share_target: {
                    action: '/share-target',
                    method: 'GET',
                    params: {
                        title: 'title',
                        text: 'text',
                        url: 'url'
                    }
                }
            }
        }),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) return undefined;
                    if (id.includes('@inertiajs')) return 'vendor-inertia';
                    if (id.includes('@tiptap') || id.includes('lowlight') || id.includes('prosemirror')) return 'vendor-tiptap';
                    if (id.includes('leaflet')) return 'vendor-leaflet';
                    if (id.includes('chart.js') || id.includes('vue-chartjs')) return 'vendor-charts';
                    if (id.includes('axios')) return 'vendor-axios';
                    if (id.includes('workbox')) return 'vendor-workbox';
                    if (id.includes('vue') || id.includes('@vue')) return 'vendor-vue';
                    return 'vendor';
                },
            },
        },
    },
});
