import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://intilaqa:intilaqa123@localhost:5432/evolution?schema=public',
  },
  tablesFilter: ["messages", "contacts"],
});
