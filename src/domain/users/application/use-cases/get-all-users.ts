import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { UsersRepository } from '../repositories/users-repository'

interface GetAllUsersUseCaseResponse {
	users: User[]
}

@Injectable()
export class GetAllUsersUseCase {
	constructor(private readonly usersRepository: UsersRepository) {}

	async execute(): Promise<GetAllUsersUseCaseResponse> {
		const users = await this.usersRepository.findAll()

		return { users }
	}
}
