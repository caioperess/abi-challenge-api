import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { User, UserProps } from '@/domain/users/application/entities/user'
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeUser(override: Partial<UserProps> = {}, id?: string) {
	const student = User.create(
		{
			name: faker.person.fullName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			...override,
		},
		id,
	)

	return student
}

@Injectable()
export class UserFactory {
	constructor(private readonly prisma: PrismaService) {}

	async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
		const user = makeUser(data)

		await this.prisma.user.create({
			data: PrismaUserMapper.toPrisma(user),
		})

		return user
	}
}
