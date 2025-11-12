import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: [
        // Exclude Puppeteer and Node.js modules from client bundle
        'puppeteer',
        'puppeteer-core',
        'puppeteer-core/lib/cjs/puppeteer',
        // Exclude Node.js built-in modules
        'fs',
        'fs/promises',
        'path',
        'util',
        'stream',
        'buffer',
        'events',
        'os',
        'crypto',
        'net',
        'tls',
        'child_process',
        'http',
        'https',
        'url',
        'zlib',
        'querystring',
      ],
    },
  },
  optimizeDeps: {
    exclude: ['puppeteer', 'puppeteer-core'],
  },
}));
