import { makeUser } from '@test/factories/make-user'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository'
import { UserNotFoundError } from './errors/user-not-found-error'
import { UpdateUserUseCase } from './update-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: UpdateUserUseCase

describe('UpdateUserUseCase', () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository()
		sut = new UpdateUserUseCase(inMemoryUsersRepository)
	})

	it('should be able to update an user', async () => {
		await inMemoryUsersRepository.create(makeUser({ createdAt: new Date(2025, 0, 20) }))

		const result = await sut.execute({
			id: inMemoryUsersRepository.users[0].id,
			name: 'John Doe',
			email: 'john.doe@example.com',
		})

		expect(result.user).toEqual(
			expect.objectContaining({
				id: inMemoryUsersRepository.users[0].id,
				name: 'John Doe',
				email: 'john.doe@example.com',
			}),
		)
	})

	it('should not be able to update an inexistent user', async () => {
		await expect(() => {
			return sut.execute({
				id: 'non-existing-id',
				name: 'John Doe',
				email: 'john.doe@example.com',
			})
		}).rejects.toBeInstanceOf(UserNotFoundError)
	})
})
