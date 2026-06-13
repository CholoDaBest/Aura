import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0', // Listen on all local IPs
    allowedHosts: ['entrepreneurs-travels-mouse-always.trycloudflare.com', 'all', '.loca.lt', '.trycloudflare.com'], // Allow tunneling tools
    cors: true // Enable CORS for external requests
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        pricing: './pricing.html',
        dashboard: './dashboard.html'
      }
    }
  }
});
