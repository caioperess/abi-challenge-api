import { User } from '@/domain/users/application/entities/user'
import { UsersRepository } from '@/domain/users/application/repositories/users-repository'

export class InMemoryUsersRepository implements UsersRepository {
	public users: User[] = []

	async create(user: User): Promise<void> {
		this.users.push(user)
	}

	async findById(id: string): Promise<User | null> {
		return this.users.find((user) => user.id === id) || null
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.users.find((user) => user.email === email) || null
	}

	async findAll(): Promise<User[]> {
		return this.users
	}

	async delete(id: string): Promise<void> {
		this.users = this.users.filter((user) => user.id !== id)
	}

	async save(user: User): Promise<void> {
		const userIndex = this.users.findIndex((u) => u.id === user.id)

		if (userIndex >= 0) {
			this.users[userIndex] = user
		}
	}
}
