import { Injectable } from '@nestjs/common'
import { AbilityBuilder, PureAbility } from '@casl/ability'
import { createPrismaAbility, Subjects } from '@casl/prisma'
import { Post, Roles, User } from '@prisma/client'

export type PermActions = 'manage' | 'create' | 'read' | 'update' | 'delete' | 'approve' | 'sell'

export type PermResources = Subjects<{ User: User; Post: Post }> | 'all'

export type AppAbility = PureAbility<[PermActions, PermResources]>

export type DefinePerm = (user: User, builder: AbilityBuilder<AppAbility>) => void

const rolePermMap: Record<Roles, DefinePerm> = {
	ADMIN: (user, { can }) => {
		can('manage', 'all')
	},
	EDITOR: (user, { can }) => {
		can('create', 'Post')
		can('read', 'Post')
		can('update', 'Post')
	},
	WRITER: (user, { can }) => {
		can('create', 'Post')
		can('read', 'Post')
		can('update', 'Post')
	},
	READER: (user, { can }) => {
		can('read', 'Post')
	},
}

@Injectable()
export class CaslAbilityService {
	private _ability: AppAbility

	public get ability(): AppAbility {
		return this._ability
	}

	createForUser(user: User) {
		const builder = new AbilityBuilder<AppAbility>(createPrismaAbility)
		rolePermMap[user.role](user, builder)
		this._ability = builder.build()
	}
}
