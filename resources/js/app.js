import './bootstrap';
import '../css/app.css';
import '../css/quiz.css';

import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

createInertiaApp({
    title: (title) => title || 'Ben İzledim',
    resolve: (name) => resolvePageComponent(
        `./Pages/${name}.vue`,
        import.meta.glob('./Pages/**/*.vue'),
    ),
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .mount(el);
        el.setAttribute('data-mounted', 'true');
        document.head
            .querySelectorAll('[data-bi-seo-fallback]')
            .forEach((element) => element.remove());
    },
});
