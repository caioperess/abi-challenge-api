import { makeUser } from '@test/factories/make-user'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository'
import { DeleteUserUseCase } from './delete-user'
import { UserNotFoundError } from './errors/user-not-found-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: DeleteUserUseCase

describe('DeleteUserUseCase', () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository()
		sut = new DeleteUserUseCase(inMemoryUsersRepository)
	})

	it('should be able to delete an user', async () => {
		await inMemoryUsersRepository.create(makeUser({ createdAt: new Date(2025, 0, 20) }))

		await sut.execute({
			id: inMemoryUsersRepository.users[0].id,
		})

		expect(inMemoryUsersRepository.users).toHaveLength(0)
	})

	it('should not be able to delete an inexistent user', async () => {
		await expect(() => {
			return sut.execute({
				id: 'non-existing-id',
			})
		}).rejects.toBeInstanceOf(UserNotFoundError)
	})
})
