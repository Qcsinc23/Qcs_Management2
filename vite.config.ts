import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import csp from 'vite-plugin-csp';

export default defineConfig({
  plugins: [
    react(),
    csp({
      policy: {
        'base-uri': ["'self'"],
        'default-src': [
          "'self'",
          "'unsafe-eval'",
          "'unsafe-inline'",
          "clerk.accounts.dev",
          "*.clerk.accounts.dev",
          "*.clerk.dev",
          "clerk.dev",
          "clerk.com",
          "*.clerk.com",
          "accounts.clerk.com",
          "cdn.jsdelivr.net",
          "fonts.googleapis.com",
          "fonts.gstatic.com"
        ],
        'script-src': [
          "'self'",
          "'unsafe-eval'",
          "'unsafe-inline'",
          "clerk.accounts.dev",
          "*.clerk.accounts.dev",
          "*.clerk.dev",
          "clerk.dev",
          "clerk.com",
          "*.clerk.com",
          "accounts.clerk.com",
          "*.stripe.com",
          "cdn.jsdelivr.net"
        ],
        'script-src-elem': [
          "'self'",
          "'unsafe-eval'",
          "'unsafe-inline'",
          "clerk.accounts.dev",
          "*.clerk.accounts.dev",
          "*.clerk.dev",
          "clerk.dev",
          "clerk.com",
          "*.clerk.com",
          "accounts.clerk.com",
          "*.stripe.com",
          "cdn.jsdelivr.net"
        ],
        'connect-src': [
          "'self'",
          "ws://localhost:*",
          "http://localhost:*",
          "clerk.accounts.dev",
          "*.clerk.accounts.dev",
          "*.clerk.dev",
          "clerk.dev",
          "clerk.com",
          "*.clerk.com",
          "accounts.clerk.com",
          "*.stripe.com",
          "api.stripe.com",
          "checkout.stripe.com",
          "wss://*.clerk.com",
          "wss://*.clerk.accounts.dev"
        ],
        'img-src': [
          "'self'",
          "data:",
          "blob:",
          "https:",
          "clerk.accounts.dev",
          "*.clerk.accounts.dev",
          "*.clerk.dev",
          "clerk.dev",
          "clerk.com",
          "*.clerk.com",
          "accounts.clerk.com",
          "images.clerk.dev"
        ],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          "fonts.googleapis.com",
          "clerk.accounts.dev",
          "*.clerk.accounts.dev",
          "*.clerk.dev",
          "clerk.dev",
          "clerk.com",
          "*.clerk.com",
          "accounts.clerk.com",
          "*.stripe.com",
          "*.mui.com",
          "cdn.jsdelivr.net"
        ],
        'font-src': [
          "'self'",
          "data:",
          "fonts.gstatic.com",
          "clerk.accounts.dev",
          "*.clerk.accounts.dev",
          "*.clerk.dev",
          "clerk.dev",
          "clerk.com",
          "*.clerk.com",
          "accounts.clerk.com",
          "*.stripe.com"
        ],
        'frame-src': [
          "'self'",
          "clerk.accounts.dev",
          "*.clerk.accounts.dev",
          "*.clerk.dev",
          "clerk.dev",
          "clerk.com",
          "*.clerk.com",
          "accounts.clerk.com",
          "*.stripe.com",
          "checkout.stripe.com"
        ],
        'object-src': ["'none'"],
        'manifest-src': ["'self'"],
        'worker-src': ["'self'", "blob:"],
        'media-src': ["'self'", "blob:", "data:"],
        'form-action': ["'self'"]
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
    cors: {
      origin: [
        'http://localhost:5175',
        'https://clerk.accounts.dev',
        'https://*.clerk.accounts.dev',
        'https://*.clerk.dev',
        'https://clerk.dev',
        'https://*.clerk.com',
        'https://clerk.com',
        'https://accounts.clerk.com'
      ],
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', '__clerk_db_jwt']
    },
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, __clerk_db_jwt',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
    }
  }
});
