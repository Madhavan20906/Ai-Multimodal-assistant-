import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    strictPort: true,
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
