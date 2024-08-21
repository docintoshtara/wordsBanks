import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createProxyMiddleware } from 'http-proxy-middleware';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api/v1/sugar': {
                target: 'http://13.126.184.29:5001',
                changeOrigin: true,
                secure: false,
            },
        },
    },
});