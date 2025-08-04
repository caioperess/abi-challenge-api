import { AuthenticateUserUseCase } from '@/domain/users/application/use-cases/authenticate';
import { CreateUserUseCase } from '@/domain/users/application/use-cases/create-user';
import { DeleteUserUseCase } from '@/domain/users/application/use-cases/delete-user';
import { GetAllUsersUseCase } from '@/domain/users/application/use-cases/get-all-users';
import { GetUserByIdUseCase } from '@/domain/users/application/use-cases/get-user-by-id';
import { UpdateUserUseCase } from '@/domain/users/application/use-cases/update-user';
import { Module } from '@nestjs/common';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { UsersController } from './controllers/users-controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [UsersController],
  providers: [
    GetAllUsersUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    CreateUserUseCase,
    DeleteUserUseCase,
    AuthenticateUserUseCase,
  ],
})
export class HttpModule {}
