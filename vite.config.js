import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'terser',
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // Vendor chunks
                    if (id.includes('node_modules/react')) return 'vendor-react';
                    if (id.includes('node_modules/lucide-react')) return 'vendor-lucide';
                    if (id.includes('node_modules/recharts')) return 'vendor-charts';
                    if (id.includes('node_modules/socket.io-client')) return 'vendor-socket';
                    if (id.includes('node_modules/axios') || 
                        id.includes('node_modules/date-fns') ||
                        id.includes('node_modules/clsx')) return 'vendor-utils';
                }
            }
        }
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            }
        }
    },
    preview: {
        host: '0.0.0.0',
        port: 5173,
    }
})
