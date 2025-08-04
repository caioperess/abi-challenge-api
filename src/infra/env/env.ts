import { z } from 'zod'

export const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
	DATABASE_URL: z.url(),
	JWT_SECRET_KEY: z.string(),
	PORT: z.coerce.number().default(3000),
	REDIS_HOST: z.string().optional().default('127.0.0.1'),
	REDIS_PORT: z.coerce.number().optional().default(6379),
	REDIS_DB: z.coerce.number().optional().default(0),
})

export type Env = z.infer<typeof envSchema>
