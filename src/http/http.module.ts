import { CreateUserUseCase } from '@/application/use-cases/create-user';
import { GetAllUsersUseCase } from '@/application/use-cases/get-all-users';
import { GetUserByIdUseCase } from '@/application/use-cases/get-user-by-id';
import { UpdateUserUseCase } from '@/application/use-cases/update-user';
import { DatabaseModule } from '@/database/database.module';
import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users-controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    GetAllUsersUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    CreateUserUseCase,
  ],
})
export class HttpModule {}
