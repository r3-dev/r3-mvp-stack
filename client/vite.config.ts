import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8090",
        changeOrigin: true,
      },
      "/_/": {
        target: "http://127.0.0.1:8090",
        changeOrigin: true,
      },
    },
  },
});
