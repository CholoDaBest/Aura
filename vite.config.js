import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all local IPs
    allowedHosts: ['entrepreneurs-travels-mouse-always.trycloudflare.com', 'all', '.loca.lt', '.trycloudflare.com'], // Allow tunneling tools
    cors: true // Enable CORS for external requests
  }
});
