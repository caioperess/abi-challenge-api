import { randomUUID } from 'node:crypto'
import { Optional } from '../types/optional'

export interface UserProps {
	name: string
	email: string
	password: string
	createdAt: Date
	updatedAt: Date
}

export class User {
	private readonly _id: string
	private readonly _props: UserProps

	constructor(props: UserProps, id?: string) {
		this._id = id ?? randomUUID()
		this._props = props
	}

	get id() {
		return this._id
	}

	get name() {
		return this._props.name
	}

	get email() {
		return this._props.email
	}

	get password() {
		return this._props.password
	}

	get createdAt() {
		return this._props.createdAt
	}

	get updatedAt() {
		return this._props.updatedAt
	}

	set name(name: string) {
		this._props.name = name
	}

	set email(email: string) {
		this._props.email = email
	}

	set updatedAt(updatedAt: Date) {
		this._props.updatedAt = updatedAt
	}

	static create(props: Optional<UserProps, 'createdAt' | 'updatedAt'>, id?: string) {
		const user = new User(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		)

		return user
	}
}
