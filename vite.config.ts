import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import csp from 'vite-plugin-csp';

export default defineConfig({
  plugins: [
    react(),
    csp({
      policy: {
        'base-uri': ["'self'"],
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          "'unsafe-eval'",
          "'unsafe-inline'", // Required for development
          "https://*.stripe.com",
          "https://*.clerk.dev",
          "https://*.clerk.com",
          "https://*.clerk.accounts.dev",
          "https://clerk.com",
          "https://accounts.clerk.com",
          "https://*.firebase.com",
          "https://*.firebaseio.com",
          "https://*.supabase.co",
          "https://*.supabase.in"
        ],
        'connect-src': [
          "'self'",
          "ws://localhost:*", // Required for HMR
          "http://localhost:*", // Required for development
          "https://*.stripe.com",
          "https://api.stripe.com",
          "https://checkout.stripe.com",
          "https://*.clerk.dev",
          "https://*.clerk.com",
          "https://*.clerk.accounts.dev",
          "https://clerk.com",
          "https://accounts.clerk.com",
          "wss://*.clerk.com",
          "wss://*.clerk.accounts.dev",
          "https://*.firebase.com",
          "https://*.firebaseio.com",
          "https://*.supabase.co",
          "https://*.supabase.in",
          "wss://*.supabase.co",
          "wss://*.supabase.in"
        ],
        'img-src': [
          "'self'",
          "data:",
          "blob:",
          "https:",
          "https://*.clerk.dev",
          "https://*.clerk.com",
          "https://*.clerk.accounts.dev",
          "https://clerk.com",
          "https://accounts.clerk.com",
          "https://*.supabase.co",
          "https://*.supabase.in",
          "https://images.clerk.dev"
        ],
        'style-src': [
          "'self'",
          "'unsafe-inline'", // Required for MUI and development
          "https://fonts.googleapis.com",
          "https://*.clerk.dev",
          "https://*.clerk.com",
          "https://*.clerk.accounts.dev",
          "https://clerk.com",
          "https://accounts.clerk.com",
          "https://js.stripe.com",
          "https://*.mui.com"
        ],
        'font-src': [
          "'self'",
          "data:",
          "https://fonts.gstatic.com",
          "https://*.clerk.dev",
          "https://*.clerk.com",
          "https://*.clerk.accounts.dev",
          "https://clerk.com",
          "https://accounts.clerk.com",
          "https://js.stripe.com"
        ],
        'frame-src': [
          "'self'",
          "https://*.stripe.com",
          "https://js.stripe.com",
          "https://checkout.stripe.com",
          "https://*.clerk.dev",
          "https://*.clerk.com",
          "https://*.clerk.accounts.dev",
          "https://clerk.com",
          "https://accounts.clerk.com"
        ],
        'object-src': ["'none'"],
        'manifest-src': ["'self'"],
        'worker-src': ["'self'", "blob:"],
        'media-src': ["'self'", "blob:", "data:"],
        'frame-ancestors': ["'self'"],
        'form-action': ["'self'"],
        'report-uri': ['/csp-report']
      } as any
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
