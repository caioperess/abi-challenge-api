import { User } from '@/domain/users/application/entities/user'

export class UserPresenter {
	static toHTTP(user: User) {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		}
	}
}
