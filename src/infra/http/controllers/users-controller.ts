import { AuthenticateUserUseCase } from '@/domain/users/application/use-cases/authenticate';
import { CreateUserUseCase } from '@/domain/users/application/use-cases/create-user';
import { UserNotFoundError } from '@/domain/users/application/use-cases/errors/user-not-found-error';
import { WrongCredentialsError } from '@/domain/users/application/use-cases/errors/wrong-credentials-error';
import { GetAllUsersUseCase } from '@/domain/users/application/use-cases/get-all-users';
import { GetUserByIdUseCase } from '@/domain/users/application/use-cases/get-user-by-id';
import { UpdateUserUseCase } from '@/domain/users/application/use-cases/update-user';
import { Public } from '@/infra/auth/public';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { UserViewModel } from '../view-models/user-view-model';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
  ) {}

  @Get()
  async getAllUsers() {
    try {
      const { users } = await this.getAllUsersUseCase.execute();

      return {
        users: users.map(UserViewModel.toHTTP),
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    try {
      const { user } = await this.getUserByIdUseCase.execute({ id });

      return {
        user: UserViewModel.toHTTP(user),
      };
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        throw new NotFoundException(err.message);
      }

      throw new BadRequestException(err.message);
    }
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() body: any) {
    try {
      const { name, email } = body;

      const { user } = await this.updateUserUseCase.execute({
        id,
        name,
        email,
      });

      return {
        user: UserViewModel.toHTTP(user),
      };
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        throw new NotFoundException(err.message);
      }

      throw new BadRequestException(err.message);
    }
  }

  @Public()
  @Post()
  async createUser(@Body() body: any) {
    try {
      const { name, email, password } = body;

      const { user } = await this.createUserUseCase.execute({
        name,
        email,
        password,
      });

      return {
        user: UserViewModel.toHTTP(user),
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Public()
  @Post('authenticate')
  async authenticate(@Body() body: any) {
    try {
      const { email, password } = body;

      const { accessToken } = await this.authenticateUserUseCase.execute({
        email,
        password,
      });

      return {
        accessToken,
      };
    } catch (err) {
      if (err instanceof WrongCredentialsError) {
        throw new UnauthorizedException(err.message);
      }

      throw new BadRequestException(err.message);
    }
  }
}
