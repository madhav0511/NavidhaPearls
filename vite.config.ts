import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

function serverApiPlugin() {
  return {
    name: 'server-api-middleware',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = req.url || '';
        if (url.startsWith('/api/products') || url.startsWith('/api/upload') || url.startsWith('/api/audit-logs')) {
          const { handleProductApiRoute } = await import('./src/server/productApi');
          const handled = await handleProductApiRoute(req, res);
          if (!handled) next();
        } else if (url.startsWith('/api/seo/')) {
          const { handleSeoApiRoute } = await import('./src/server/seoApi');
          const handled = await handleSeoApiRoute(req, res);
          if (!handled) next();
        } else if (url.startsWith('/api/aisensy/')) {
          const { handleAiSensyApiRoute } = await import('./src/server/aisensyProxy');
          const handled = await handleAiSensyApiRoute(req, res);
          if (!handled) next();
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), serverApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          faq: path.resolve(__dirname, 'faq.html'),
          shipping: path.resolve(__dirname, 'shipping-returns.html'),
          privacy: path.resolve(__dirname, 'privacy-policy.html'),
          consultation: path.resolve(__dirname, 'consultation.html'),
          widget: path.resolve(__dirname, 'appointment-booking-widget.html'),
          sitemap: path.resolve(__dirname, 'sitemap.html'),
          catalog: path.resolve(__dirname, 'catalog-manager.html'),
        },
      },
    },
  };
});
