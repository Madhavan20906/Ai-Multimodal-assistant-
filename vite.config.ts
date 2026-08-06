import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite plugin: proxy /api/groq to Groq API using the server-side secret.
// The key never reaches the browser bundle.
function groqProxyPlugin() {
  return {
    name: 'groq-proxy',
    configureServer(server: any) {
      server.middlewares.use('/api/groq', async (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method not allowed');
          return;
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'GROQ_API_KEY secret not set' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
        req.on('end', async () => {
          try {
            const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              body,
            });
            const data = await upstream.json();
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = upstream.status;
            res.end(JSON.stringify(data));
          } catch (e: any) {
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: e?.message ?? String(e) }));
          }
        });
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), groqProxyPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    strictPort: true,
    watch: {
      // Ignore Replit internal skill/agent directories to prevent spurious reloads
      ignored: ['**/.local/**', '**/.agents/**', '**/node_modules/**'],
    },
  },
  build: {
    // Both lightningcss and esbuild native binaries are unavailable on this
    // Nix/Linux platform — disable CSS minification so the build completes.
    cssMinify: false,
  },
  optimizeDeps: {
    // MediaPipe packages contain WASM and cannot be pre-bundled by Vite
    exclude: [
      '@mediapipe/hands',
      '@mediapipe/camera_utils',
    ],
  },
})
