import { FakeHasher } from '@test/cryptography/fake-hasher'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository'
import { CreateUserUseCase } from './create-user'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let sut: CreateUserUseCase

describe('CreateUserUseCase', () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository()
		fakeHasher = new FakeHasher()
		sut = new CreateUserUseCase(inMemoryUsersRepository, fakeHasher)
	})

	it('should be able to create an user', async () => {
		const result = await sut.execute({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: '123456',
		})

		expect(result.user.id).toEqual(inMemoryUsersRepository.users[0].id)
	})

	it('should hash user password', async () => {
		await sut.execute({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: '123456',
		})

		const hashedPassword = await fakeHasher.hash('123456')

		expect(inMemoryUsersRepository.users[0].password).toEqual(hashedPassword)
	})

	it('should not be able to create an user with same email', async () => {
		await sut.execute({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: '123456',
		})

		expect(() => {
			return sut.execute({
				name: 'John Doe',
				email: 'john.doe@example.com',
				password: '123456',
			})
		}).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})
})
