import { z } from 'zod'

export const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
	DATABASE_URL: z.url(),
	JWT_SECRET: z.string(),
	PORT: z.coerce.number().default(3000),
})

export type Env = z.infer<typeof envSchema>
