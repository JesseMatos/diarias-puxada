import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    adapter: "sqlite",
    url: "file:./dev.db",   // banco será um arquivo dev.db dentro do projeto
  },
});