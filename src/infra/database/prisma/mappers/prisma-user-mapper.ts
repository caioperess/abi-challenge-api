import { Prisma, User as RawUser } from '@prisma/client'
import { User } from '@/domain/users/application/entities/user'

export class PrismaUserMapper {
	static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			password: user.password,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		}
	}

	static toDomain(raw: RawUser): User {
		return User.create(
			{
				name: raw.name,
				email: raw.email,
				password: raw.password,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			raw.id,
		)
	}
}
