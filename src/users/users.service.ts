import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import bcrypt from 'bcrypt'
import { Roles } from '@prisma/client'
import { AppAbility, CaslAbilityService } from 'src/casl/casl.ability/casl.ability.service'
import { accessibleBy } from '@casl/prisma'

@Injectable()
export class UsersService {
	constructor(
		private readonly caslAbilityService: CaslAbilityService,
		private readonly prismaService: PrismaService
	) {}

	public get ability(): AppAbility {
		return this.caslAbilityService.ability
	}

	create(createUserDto: CreateUserDto) {
		if (!this.ability.can('create', 'User')) {
			throw new Error('You are not allowed to create a user')
		}

		return this.prismaService.user.create({
			data: {
				...createUserDto,
				password: bcrypt.hashSync(createUserDto.password, 10 /* Salt*/),
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				permissions: createUserDto.permissions as any,
				role: createUserDto.role.toUpperCase() as Roles,
			},
		})
	}

	findAll() {
		if (!this.ability.can('read', 'User')) {
			throw new Error('You are not allowed to read users')
		}

		return this.prismaService.user.findMany({
			where: {
				AND: [accessibleBy(this.ability).User],
			},
		})
	}

	findOne(id: string) {
		return this.prismaService.user.findUnique({
			where: { id },
		})
	}

	findOneByEmail(email: string) {
		return this.prismaService.user.findUnique({
			where: { email },
		})
	}

	update(id: string, updateUserDto: UpdateUserDto) {
		if (!this.ability.can('update', 'User')) {
			throw new Error('You are not allowed to update a user')
		}

		return this.prismaService.user.update({
			where: { id },
			data: {
				...updateUserDto,
				password: updateUserDto.password
					? bcrypt.hashSync(updateUserDto.password, 10 /* Salt*/)
					: undefined,
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				permissions: updateUserDto.permissions as any,
				role: updateUserDto.role ? (updateUserDto.role.toUpperCase() as Roles) : undefined,
			},
		})
	}

	remove(id: string) {
		if (!this.caslAbilityService.ability.can('delete', 'User')) {
			throw new Error('You are not allowed to delete a user')
		}

		return this.prismaService.user.delete({
			where: { id },
		})
	}
}
