import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@/pages": path.resolve(__dirname, "src/pages"),
      "@/components": path.resolve(__dirname, "src/components"),
      "@/layouts": path.resolve(__dirname, "src/layouts"),
      "@/routes": path.resolve(__dirname, "src/routes"),
      "@/providers": path.resolve(__dirname, "src/providers"),
      "@/utils": path.resolve(__dirname, "src/utils"),
    },
  },
});
