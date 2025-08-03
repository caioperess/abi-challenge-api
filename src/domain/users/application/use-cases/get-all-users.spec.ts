import { makeUser } from '@test/factories/make-user';
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository';
import { GetAllUsersUseCase } from './get-all-users';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: GetAllUsersUseCase;

describe('GetAllUsersUseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new GetAllUsersUseCase(inMemoryUsersRepository);
  });

  it('should be able to get all users', async () => {
    await inMemoryUsersRepository.create(
      makeUser({ createdAt: new Date(2025, 0, 20) }),
    );
    await inMemoryUsersRepository.create(
      makeUser({ createdAt: new Date(2025, 0, 18) }),
    );

    const result = await sut.execute();

    expect(result.users).toHaveLength(2);

    expect(result.users).toEqual([
      expect.objectContaining({
        createdAt: new Date(2025, 0, 20),
      }),
      expect.objectContaining({
        createdAt: new Date(2025, 0, 18),
      }),
    ]);
  });
});
