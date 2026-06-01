import { defineConfig } from "prisma/config";

// Читаем напрямую из process.env, чтобы команды без подключения к БД
// (например, `prisma generate` при сборке Docker-образа) не падали из-за
// отсутствующей переменной. Реальные значения приходят из окружения в рантайме.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL ?? "",
    directUrl: process.env.DIRECT_URL ?? "",
  },
});
