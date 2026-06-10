import './lib/load-env';
import { defineConfig } from 'prisma/config';

// Fallback allows `prisma generate` in CI before runtime secrets are available.
const databaseUrl =
  process.env.DATABASE_URL ??
  'postgresql://user:password@localhost:5432/neondb?schema=public';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: databaseUrl,
  },
});
