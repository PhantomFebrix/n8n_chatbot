import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Ngrok üzerinden erişilecek alan adını buraya gir
const NGROK_HOST = '91e32a084857.ngrok-free.app';

export default defineConfig({
    plugins: [react()],
    server: {
        host: true, // 0.0.0.0 dinle
        port: 5173,
        allowedHosts: [NGROK_HOST],
        origin: `https://${NGROK_HOST}`,
        hmr: {
            host: NGROK_HOST,
            protocol: 'wss',
            clientPort: 443,
        },
    },
});
