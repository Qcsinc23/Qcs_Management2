import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import csp from 'vite-plugin-csp';

export default defineConfig({
  plugins: [
    react(),
    csp({
      policy: {
        'base-uri': ['self'],
        'default-src': ['self'],
        'script-src': [
          'self',
          'unsafe-inline',
          'unsafe-eval',
          'https://*.clerk.com',
          'https://*.clerk.accounts.dev',
          'https://*.stripe.com',
          'https://js.stripe.com',
          'https://accounts.clerk.com',
          'https://clerk.com'
        ],
        'connect-src': [
          'self',
          'https://*.clerk.com',
          'https://*.clerk.accounts.dev',
          'wss://*.clerk.com',
          'wss://*.clerk.accounts.dev',
          'https://api.stripe.com',
          'https://checkout.stripe.com',
          'https://accounts.clerk.com',
          'https://clerk.com',
          'ws://localhost:*',
          'http://localhost:*'
        ],
        'img-src': [
          'self',
          'https://*.clerk.com',
          'https://*.clerk.accounts.dev',
          'https://accounts.clerk.com',
          'https://clerk.com',
          'data:',
          'blob:'
        ],
        'frame-src': [
          'self',
          'https://*.clerk.com',
          'https://*.clerk.accounts.dev',
          'https://*.stripe.com',
          'https://js.stripe.com',
          'https://checkout.stripe.com',
          'https://accounts.clerk.com',
          'https://clerk.com',
          'blob:',
          'data:'
        ],
        'style-src': [
          'self',
          'unsafe-inline',
          'https://fonts.googleapis.com',
          'https://js.stripe.com',
          'https://*.clerk.com',
          'https://*.clerk.accounts.dev',
          'https://accounts.clerk.com',
          'https://clerk.com',
          'https://*.mui.com'
        ],
        'font-src': [
          'self',
          'https://fonts.gstatic.com',
          'https://*.clerk.com',
          'https://*.clerk.accounts.dev',
          'https://accounts.clerk.com',
          'https://clerk.com',
          'data:'
        ],
        'worker-src': [
          'self',
          'blob:'
        ],
        'manifest-src': ['self'],
        'media-src': ['self', 'blob:', 'data:']
      }
    })
  ],
  optimizeDeps: {
    include: ['lucide-react'],
  },
  server: {
    port: 5175,
    strictPort: true,
    open: true,
    cors: true,
    hmr: {
      port: 5175,
    },
    headers: {
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block'
    }
  }
});
