import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ command, mode, isSsrBuild }) => ({
    build: {
        chunkSizeWarningLimit: 1000,
        // Production optimizations
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
        // Enable code splitting for better caching (only for client build)
        rollupOptions: isSsrBuild ? {} : {
            output: {
                manualChunks: {
                    // Split vendor chunks for better caching
                    'vendor-vue': ['vue', '@inertiajs/vue3'],
                    'vendor-charts': ['apexcharts', 'vue3-apexcharts'],
                    'vendor-utils': ['lodash', 'axios'],
                    'vendor-leaflet': ['leaflet', '@vue-leaflet/vue-leaflet'],
                },
                // Optimize chunk file names for better caching
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
            },
        },
        // Generate source maps only in development
        sourcemap: false,
        // Optimize CSS
        cssCodeSplit: true,
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
        noExternal: ['@inertiajs/server']
    },
    server: {
        cors: {
            origin: 'https://application-rsm.test',
        }
    },
    // Optimize dependencies
    optimizeDeps: {
        include: ['vue', '@inertiajs/vue3', 'axios', 'lodash'],
    },
}));
