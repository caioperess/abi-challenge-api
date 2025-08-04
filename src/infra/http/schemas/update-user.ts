import { z } from 'zod'

export const updateUserSchema = z.object({
	name: z.string(),
	email: z.email(),
})

export type UpdateUserSchema = z.infer<typeof updateUserSchema>
