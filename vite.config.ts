import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const gcUser = env.VITE_GC_USER ?? '';
  const gcPass = env.VITE_GC_PASS ?? '';
  const gcUrl = env.VITE_GC_URL ?? '';

  return {
    plugins: [react()],
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
    },
    server: {
      proxy: {
        '/api/metrics': {
          target: `https://${gcUrl}`,
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/api\/metrics/, '/api/v1/push/influx/write'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              const creds = Buffer.from(`${gcUser}:${gcPass}`).toString('base64');
              proxyReq.setHeader('Authorization', `Basic ${creds}`);
              proxyReq.setHeader('Content-Type', 'text/plain');

              const chunks: Buffer[] = [];
              req.on('data', (chunk: Buffer) => chunks.push(chunk));
              req.on('end', () => {
                const body = Buffer.concat(chunks).toString();
                if (body) console.log(`[metrics-payload]\n${body}`);
              });
            });
            proxy.on('proxyRes', (proxyRes, req) => {
              console.log(`[metrics] ${req.method} ${req.url} → ${proxyRes.statusCode}`);
            });
            proxy.on('error', (err) => {
              console.error('[metrics] proxy error:', err.message);
            });
          },
        },
      },
    },
  };
});
