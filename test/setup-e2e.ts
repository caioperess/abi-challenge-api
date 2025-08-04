import { envSchema } from '@/infra/env/env';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import Redis from 'ioredis';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

config({ path: '.env', override: true });
config({ path: '.env.test', override: true });

const prisma = new PrismaClient();

const env = envSchema.parse(process.env);

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
});

export function generateUniqueDatabaseURL(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable');
  }

  const url = new URL(env.DATABASE_URL);

  url.searchParams.set('schema', schemaId);

  return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
  console.log('Setting up E2E tests...');

  const databaseURL = generateUniqueDatabaseURL(schemaId);

  process.env.DATABASE_URL = databaseURL;

  await redis.flushdb();

  try {
    execSync('pnpm prisma db push', {
      env: {
        ...process.env,
        DATABASE_URL: databaseURL,
      },
    });
  } catch (err) {
    console.log('Error running migrations', err);
  }

  console.log('✅ E2E tests setup complete');
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();

  console.log('✅ E2E tests teardown complete');
});
