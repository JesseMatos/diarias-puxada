import "dotenv/config";
import { defineConfig } from "prisma/config";
import { SQLiteAdapter } from "prisma/adapter-sqlite";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    provider: "sqlite",
    adapter: new SQLiteAdapter("file:./dev.db"),
  },
});
