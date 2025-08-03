import { FakeEncrypter } from '@test/cryptography/fake-encrypter'
import { FakeHasher } from '@test/cryptography/fake-hasher'
import { makeUser } from '@test/factories/make-user'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository'
import { AuthenticateUserUseCase } from './authenticate'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUserUseCase

describe('AuthenticateUserUseCase', () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository()
		fakeHasher = new FakeHasher()
		fakeEncrypter = new FakeEncrypter()

		sut = new AuthenticateUserUseCase(inMemoryUsersRepository, fakeHasher, fakeEncrypter)
	})

	it('should be able to authenticate an user', async () => {
		await inMemoryUsersRepository.create(
			makeUser({
				email: 'john.doe@example.com',
				password: await fakeHasher.hash('123456'),
			}),
		)

		const result = await sut.execute({
			email: 'john.doe@example.com',
			password: '123456',
		})

		expect(result).toEqual({
			accessToken: expect.any(String),
		})
	})

	it('should not be able to authenticate an user with wrong credentials', async () => {
		expect(() => {
			return sut.execute({
				email: 'john.doe@example.com',
				password: '123456',
			})
		}).rejects.toBeInstanceOf(WrongCredentialsError)
	})
})
