import { Injectable, Scope } from '@nestjs/common'
import { AbilityBuilder, PureAbility } from '@casl/ability'
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma'
import { Post, Roles, User } from '@prisma/client'

export type PermActions = 'manage' | 'create' | 'read' | 'update' | 'delete' | 'approve' | 'sell'

export type PermResources = Subjects<{ User: User; Post: Post }> | 'all'

export type AppAbility = PureAbility<[PermActions, PermResources], PrismaQuery>

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
		can('read', 'Post', { authorId: user.id })
		can('update', 'Post', { authorId: user.id })
		can('delete', 'Post', { authorId: user.id })
	},
	READER: (user, { can }) => {
		can('read', 'Post', { published: true })
	},
}

@Injectable({ scope: Scope.REQUEST })
export class CaslAbilityService {
	private _ability: AppAbility

	public get ability(): AppAbility {
		return this._ability
	}

	createForUser(user: User): AppAbility {
		const builder = new AbilityBuilder<AppAbility>(createPrismaAbility)

		if (user.permissions) {
			;(user.permissions as PrismaJson.PermList).forEach((perm) => {
				builder.can(perm.action, perm.resource as any, perm.condition)
			})
		}

		rolePermMap[user.role](user, builder)
		this._ability = builder.build()
		return this._ability
	}
}
