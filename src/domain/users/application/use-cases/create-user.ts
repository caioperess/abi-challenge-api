import { Injectable } from '@nestjs/common';
import { User } from '../entities/user';
import { UsersRepository } from '../repositories/users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

interface CreateUserUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface CreateUserUseCaseResponse {
  user: User;
}

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const hasUserWithSameEmail = await this.usersRepository.findByEmail(email);

    if (hasUserWithSameEmail) {
      throw new UserAlreadyExistsError(email);
    }

    const user = User.create({
      name,
      email,
      password,
    });

    await this.usersRepository.create(user);

    return { user };
  }
}
