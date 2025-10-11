import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0", // listen on all IPv4 interfaces for LAN access
    port: 8080,
    cors: true,
  },
  // plugins: [
  //   react(),
  //   mode === 'development' &&
  //   componentTagger(),
  // ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
