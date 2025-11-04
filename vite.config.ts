// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

function getCurrentDir() {
  try {
    return __dirname;
  } catch {
    return path.dirname(fileURLToPath(import.meta.url));
  }
}

const currentDir = getCurrentDir();

export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(currentDir, "client", "src"),
      "@bilesenler": path.resolve(currentDir, "client", "src", "bilesenler"),
      "@arayuz": path.resolve(currentDir, "client", "src", "bilesenler", "arayuz"),
      "@sayfalar": path.resolve(currentDir, "client", "src", "sayfalar"),
      "@hooks": path.resolve(currentDir, "client", "src", "hooks"),
      "@kutuphane": path.resolve(currentDir, "client", "src", "kutuphane"),
      "@stiller": path.resolve(currentDir, "client", "src", "stiller"),
      "@shared": path.resolve(currentDir, "shared"),
      "@assets": path.resolve(currentDir, "attached_assets"),
    },
  },
  root: path.resolve(currentDir, "client"),
  publicDir: path.resolve(currentDir, "client", "public"),
  build: {
    outDir: path.resolve(currentDir, "dist/public"),
    emptyOutDir: true,
  },
  logLevel: 'error',
  server: {
    host: "0.0.0.0",
    port: 5000,
    hmr: {
      port: 5000,
    },
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
