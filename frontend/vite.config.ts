import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/spotify": "https://spectralise-backend.vercel.app/",
      "/api": "https://spectralise-backend.vercel.app/",
    },
  },
  plugins: [vue(), tailwindcss()],
});
