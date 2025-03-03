import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    build: {
        chunkSizeWarningLimit: 1000, // Ubah nilai ini sesuai kebutuhan (dalam kB)
    },
    plugins: [
        laravel({
            input: 'resources/js/app.js',
            ssr: 'ssr.js',
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
    ssr: {
        noExternal: ['@inertiajs/server'] // Hindari error dependensi eksternal
    },
    server: {
        cors: {
            origin: 'https://application-rsm.test',
        }
    }
});
