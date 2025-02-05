import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode`
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),

      // Progressive Web App configuration
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'QCS Management App',
          short_name: 'QCS App',
          description: 'Comprehensive management application',
          theme_color: '#3b82f6',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
    ],

    // Environment variables
    define: {
      'import.meta.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(env.VITE_CLERK_PUBLISHABLE_KEY),
    },

    // Build optimizations
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },

    // Development server configuration
    server: {
      port: 5175,
      strictPort: true,
      open: true,
      headers: {
        'Content-Security-Policy': `
          default-src 'self';
          script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://clerk.clerk.com https://*.clerk.com https://js.clerk.com https://accounts.google.com;
          connect-src 'self' https://*.clerk.accounts.dev https://clerk.clerk.com https://*.clerk.com https://api.clerk.com https://accounts.google.com wss://clerk.clerk.com;
          img-src 'self' data: https://*.clerk.com https://img.clerk.com https://lh3.googleusercontent.com;
          style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
          font-src 'self' https://fonts.gstatic.com;
          frame-src 'self' https://*.clerk.accounts.dev https://clerk.clerk.com https://*.clerk.com https://accounts.google.com;
          worker-src 'self' blob:;
          manifest-src 'self';
          base-uri 'self';
          form-action 'self';
          frame-ancestors 'none';
        `.replace(/\s+/g, ' ').trim(),
      },
    },

    // Resolve configuration
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  }
})
