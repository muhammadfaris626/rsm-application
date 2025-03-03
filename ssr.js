
import { createSSRApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { renderToString } from '@vue/server-renderer'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createServer } from 'vite';

createServer((page) =>
  renderToString(
    createSSRApp({
      render: () =>
        h(createInertiaApp, {
          page,
          render: renderToString,
          resolve: (name) =>
            resolvePageComponent(
              `./resources/js/Pages/${name}.vue`,
              import.meta.glob('./resources/js/Pages/**/*.vue')
            ),
          setup({ el, App, props, plugin }) {
            return createSSRApp({ render: () => h(App, props) }).use(plugin)
          },
        }),
    })
  )
)
