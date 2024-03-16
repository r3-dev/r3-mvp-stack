import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { resolve } from "node:path";

const backendBaseUrl =
  process.env.PUBLIC_BACKEND_URL || "http://127.0.0.1:8090";

const port = process.env.FRONTEND_PORT ? parseInt(process.env.FRONTEND_PORT) : 3000;

export default defineConfig({
  plugins: [solid()],
  server: {
    port: port,
    proxy: {
      "/api": {
        target: backendBaseUrl,
        changeOrigin: true,
      },
      "/_/": {
        target: backendBaseUrl,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
