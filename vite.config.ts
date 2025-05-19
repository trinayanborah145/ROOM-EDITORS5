import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import viteCompression from 'vite-plugin-compression';
import legacy from '@vitejs/plugin-legacy';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: './', // This ensures assets are loaded correctly in production
  plugins: [
    // Core plugins
    react(),
    
    // Image optimization
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { lossless: true },
    }),
    
    // Gzip/Brotli compression
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024, // Only compress files > 1KB
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024, // Only compress files > 1KB
    }),
    
    // Legacy browser support
    legacy({
      targets: ['defaults', 'not IE 11'],
      modernPolyfills: true,
    }),
    
    // Bundle analyzer
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
    sourcemap: false, // Disable source maps in production
    reportCompressedSize: false, // Disable gzip size reporting for faster builds
    target: 'esnext', // Target modern browsers
    modulePreload: {
      polyfill: false, // Disable module preload polyfill as we're targeting modern browsers
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@tanstack')) {
              return 'vendor.react-query';
            }
            if (id.includes('react-icons')) {
              return 'vendor.icons';
            }
            if (id.includes('react-dom')) {
              return 'vendor.react-dom';
            }
            if (id.includes('react')) {
              return 'vendor.react';
            }
            return 'vendor';
          }
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
