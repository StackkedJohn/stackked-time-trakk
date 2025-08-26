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
}));
// In your vite.config.ts, replace the direct import with:
let lovableTagger;
try {
  lovableTagger = require('lovable-tagger');
} catch (e) {
  // lovable-tagger not available in production build
  lovableTagger = null;
}

// Then use it conditionally in your plugins array
export default defineConfig({
  plugins: [
    react(),
    // Only use lovable-tagger if available
    ...(lovableTagger ? [lovableTagger()] : [])
  ],
  // ... rest of config
})
