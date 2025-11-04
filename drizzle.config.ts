///BERATCANKIR OZEL ANALİZ TAKIP SISTEMI
//sql gecersem geliştirme ortamı için
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/sema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://placeholder",
  },
});

// CANKIR