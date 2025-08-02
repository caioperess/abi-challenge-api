import { Injectable } from '@nestjs/common';
import { User } from '../entities/user';
import { UsersRepository } from '../repositories/users-repository';

interface UpdateUserUseCaseRequest {
  id: string;
  name: string;
  email: string;
}

interface UpdateUserUseCaseResponse {
  user: User;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    id,
    name,
    email,
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    user.name = name;
    user.email = email;
    user.updatedAt = new Date();

    await this.usersRepository.save(user);

    return { user };
  }
}
