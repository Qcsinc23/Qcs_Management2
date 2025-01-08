import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import csp from 'vite-plugin-csp';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    csp({
      policy: {
        'base-uri': ["self"],
        'default-src': ["self"],
        'script-src': [
          "self",
          "unsafe-inline",
          "unsafe-eval",
          'https://*.clerk.com',
          'https://*.clerk.accounts.dev',
          'https://*.clerk.dev',
          'https://*.clerkstage.dev',
          'https://*.stripe.com',
          'https://js.stripe.com'
        ],
        'connect-src': [
          "self",
          'https://*.clerk.com',
          'https://*.clerk.accounts.dev',
          'https://*.clerk.dev',
          'https://*.clerkstage.dev',
          'wss://*.clerk.com',
          'wss://*.clerk.accounts.dev',
          'https://api.stripe.com',
          'https://checkout.stripe.com'
        ],
        'img-src': [
          "self",
          'https://*.clerk.com',
          'https://*.clerk.accounts.dev',
          'https://*.clerk.dev',
          'https://*.clerkstage.dev',
          'data:',
          'blob:'
        ],
        'frame-src': [
          "self",
          'https://*.clerk.com',
          'https://*.clerk.accounts.dev',
          'https://*.clerk.dev',
          'https://*.clerkstage.dev',
          'https://*.stripe.com',
          'https://js.stripe.com',
          'https://checkout.stripe.com'
        ],
        'frame-ancestors': [
          "self",
          'https://*.clerk.com',
          'https://*.clerk.accounts.dev'
        ],
        'form-action': ["self"],
        'style-src': [
          "self",
          "unsafe-inline",
          'https://*.clerk.com',
          'https://*.clerk.accounts.dev',
          'https://*.clerk.dev',
          'https://*.clerkstage.dev',
          'https://fonts.googleapis.com',
          'https://js.stripe.com'
        ],
        'font-src': [
          "self",
          "data:",
          'https://*.clerk.com',
          'https://*.clerk.accounts.dev',
          'https://fonts.gstatic.com',
          'https://js.stripe.com'
        ],
        'object-src': ["none"],
        'worker-src': [
          "self",
          'blob:',
          'https://*.clerk.com',
          'https://*.clerk.accounts.dev'
        ]
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
