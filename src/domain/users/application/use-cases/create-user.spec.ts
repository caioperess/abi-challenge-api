import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository';
import { CreateUserUseCase } from './create-user';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: CreateUserUseCase;

describe('CreateUserUseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to create an user', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    expect(result.user.id).toEqual(inMemoryUsersRepository.users[0].id);
  });

  it('should not be able to create an user with same email', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    expect(() => {
      return sut.execute({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '123456',
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
