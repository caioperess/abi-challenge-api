import { makeUser } from '@test/factories/make-user'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository'
import { UserNotFoundError } from './errors/user-not-found-error'
import { GetUserByIdUseCase } from './get-user-by-id'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetUserByIdUseCase

describe('GetUserByIdUseCase', () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository()
		sut = new GetUserByIdUseCase(inMemoryUsersRepository)
	})

	it('should be able to get an user by id', async () => {
		await inMemoryUsersRepository.create(makeUser({ createdAt: new Date(2025, 0, 20) }))

		const result = await sut.execute({
			id: inMemoryUsersRepository.users[0].id,
		})

		expect(result.user).toEqual(
			expect.objectContaining({
				id: inMemoryUsersRepository.users[0].id,
				createdAt: new Date(2025, 0, 20),
			}),
		)
	})

	it('should not be able to get an inexistent user', async () => {
		await expect(() => {
			return sut.execute({
				id: 'non-existing-id',
			})
		}).rejects.toBeInstanceOf(UserNotFoundError)
	})
})
