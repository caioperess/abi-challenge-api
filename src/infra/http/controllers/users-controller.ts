import { CreateUserUseCase } from '@/domain/users/application/use-cases/create-user';
import { GetAllUsersUseCase } from '@/domain/users/application/use-cases/get-all-users';
import { GetUserByIdUseCase } from '@/domain/users/application/use-cases/get-user-by-id';
import { UpdateUserUseCase } from '@/domain/users/application/use-cases/update-user';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserViewModel } from '../view-models/user-view-model';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @Get()
  async getAllUsers() {
    const { users } = await this.getAllUsersUseCase.execute();

    return {
      users: users.map(UserViewModel.toHTTP),
    };
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const { user } = await this.getUserByIdUseCase.execute({ id });

    return {
      user: UserViewModel.toHTTP(user),
    };
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() body: any) {
    const { name, email } = body;

    const { user } = await this.updateUserUseCase.execute({
      id,
      name,
      email,
    });

    return {
      user: UserViewModel.toHTTP(user),
    };
  }

  @Post()
  async createUser(@Body() body: any) {
    const { name, email, password } = body;

    const { user } = await this.createUserUseCase.execute({
      name,
      email,
      password,
    });

    return {
      user: UserViewModel.toHTTP(user),
    };
  }
}
