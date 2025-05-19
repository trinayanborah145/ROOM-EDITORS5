import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: './', // This ensures assets are loaded correctly in production
  plugins: [
    react(),
    ViteImageOptimizer({
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      jpg: {
        quality: 80,
      },
      webp: {
        lossless: true,
      },
    }),
    mode === 'analyze' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react-router-dom',
        'react-dropzone',
        'react-icons/fi',
        'react-icons',
        'axios',
        '@tanstack/react-query',
      ],
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            'react-dropzone',
            'axios'
          ],
          reactIcons: ['react-icons/fi', 'react-icons'],
          reactQuery: ['@tanstack/react-query']
        }
      },
    },
    chunkSizeWarningLimit: 1000, // in kbs
    minify: 'terser',
    cssCodeSplit: true,
    target: 'esnext',
    sourcemap: mode !== 'production',
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['lucide-react'],
  },
  css: {
    devSourcemap: mode === 'development',
    modules: {
      generateScopedName: mode === 'development' ? '[name]__[local]' : '[hash:base64:5]',
    },
  },
}));
