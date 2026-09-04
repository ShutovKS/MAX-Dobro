// FILE: backend/prisma.config.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Prisma CLI config for schema path, migrations, and datasource URLs.
//   SCOPE: schema location, migration path, DATABASE_URL and DIRECT_URL from env
//   DEPENDS: none
//   LINKS: M-SCHEMA, M-PRISMA, V-M-SCHEMA
//   ROLE: CONFIG
//   MAP_MODE: NONE
// END_MODULE_CONTRACT
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

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
