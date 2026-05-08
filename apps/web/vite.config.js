import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
// Set GITHUB_PAGES=true in CI env to enable the correct base path.
// Update the repo name below if your GitHub repo is named differently.
const repoBase = process.env['GITHUB_PAGES'] === 'true' ? '/tasks-and-alerts/' : '/';
export default defineConfig({
    base: repoBase,
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['icons/icon.svg', 'icons/maskable.svg'],
            manifest: {
                name: 'Tasks & Alerts',
                short_name: 'TasksAlerts',
                description: 'Local-first task and alert management',
                theme_color: '#170022',
                background_color: '#170022',
                display: 'standalone',
                orientation: 'portrait',
                scope: repoBase,
                start_url: repoBase,
                icons: [
                    {
                        src: 'icons/icon.svg',
                        sizes: 'any',
                        type: 'image/svg+xml',
                        purpose: 'any',
                    },
                    {
                        src: 'icons/maskable.svg',
                        sizes: 'any',
                        type: 'image/svg+xml',
                        purpose: 'maskable',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
            },
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/tests/setup.ts'],
        passWithNoTests: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
        },
    },
});
