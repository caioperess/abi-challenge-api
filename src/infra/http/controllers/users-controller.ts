import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Post,
	Put,
	UnauthorizedException,
} from '@nestjs/common'
import { AuthenticateUserUseCase } from '@/domain/users/application/use-cases/authenticate'
import { CreateUserUseCase } from '@/domain/users/application/use-cases/create-user'
import { DeleteUserUseCase } from '@/domain/users/application/use-cases/delete-user'
import { UserNotFoundError } from '@/domain/users/application/use-cases/errors/user-not-found-error'
import { WrongCredentialsError } from '@/domain/users/application/use-cases/errors/wrong-credentials-error'
import { GetAllUsersUseCase } from '@/domain/users/application/use-cases/get-all-users'
import { GetUserByIdUseCase } from '@/domain/users/application/use-cases/get-user-by-id'
import { UpdateUserUseCase } from '@/domain/users/application/use-cases/update-user'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { UserPresenter } from '../presenters/user-presenter'
import { type AuthenticateSchema, authenticateSchema } from '../schemas/authenticate'
import { type CreateUserSchema, createUserSchema } from '../schemas/create-user'
import { type UpdateUserSchema, updateUserSchema } from '../schemas/update-user'

const createUserValidationPipe = new ZodValidationPipe(createUserSchema)
const updateUserValidationPipe = new ZodValidationPipe(updateUserSchema)
const authenticateValidationPipe = new ZodValidationPipe(authenticateSchema)

@Controller('users')
export class UsersController {
	constructor(
		private readonly createUserUseCase: CreateUserUseCase,
		private readonly updateUserUseCase: UpdateUserUseCase,
		private readonly getAllUsersUseCase: GetAllUsersUseCase,
		private readonly getUserByIdUseCase: GetUserByIdUseCase,
		private readonly deleteUserUseCase: DeleteUserUseCase,
		private readonly authenticateUserUseCase: AuthenticateUserUseCase,
	) {}

	@Get()
	async getAllUsers() {
		try {
			const { users } = await this.getAllUsersUseCase.execute()

			return {
				users: users.map(UserPresenter.toHTTP),
			}
		} catch (err) {
			throw new BadRequestException(err.message)
		}
	}

	@Get(':id')
	async getUser(@Param('id') id: string) {
		try {
			const { user } = await this.getUserByIdUseCase.execute({ id })

			return {
				user: UserPresenter.toHTTP(user),
			}
		} catch (err) {
			if (err instanceof UserNotFoundError) {
				throw new NotFoundException(err.message)
			}

			throw new BadRequestException(err.message)
		}
	}

	@Put(':id')
	async updateUser(@Param('id') id: string, @Body(updateUserValidationPipe) body: UpdateUserSchema) {
		try {
			const { name, email } = body

			const { user } = await this.updateUserUseCase.execute({
				id,
				name,
				email,
			})

			return {
				user: UserPresenter.toHTTP(user),
			}
		} catch (err) {
			if (err instanceof UserNotFoundError) {
				throw new NotFoundException(err.message)
			}

			throw new BadRequestException(err.message)
		}
	}

	@Post()
	async createUser(@Body(createUserValidationPipe) body: CreateUserSchema) {
		try {
			const { name, email, password } = body

			const { user } = await this.createUserUseCase.execute({
				name,
				email,
				password,
			})

			return {
				user: UserPresenter.toHTTP(user),
			}
		} catch (err) {
			throw new BadRequestException(err.message)
		}
	}

	@Delete(':id')
	async deleteUser(@Param('id') id: string) {
		try {
			await this.deleteUserUseCase.execute({ id })

			return {
				message: 'User deleted successfully',
			}
		} catch (err) {
			if (err instanceof UserNotFoundError) {
				throw new NotFoundException(err.message)
			}

			throw new BadRequestException(err.message)
		}
	}

	@Public()
	@Post('authenticate')
	async authenticate(@Body(authenticateValidationPipe) body: AuthenticateSchema) {
		try {
			const { email, password } = body

			const { user, accessToken } = await this.authenticateUserUseCase.execute({
				email,
				password,
			})

			return {
				user: UserPresenter.toHTTP(user),
				accessToken,
			}
		} catch (err) {
			if (err instanceof WrongCredentialsError) {
				throw new UnauthorizedException(err.message)
			}

			throw new BadRequestException(err.message)
		}
	}
}
