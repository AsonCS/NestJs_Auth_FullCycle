import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import bcrypt from 'bcrypt'
import { Roles } from '@prisma/client'

@Injectable()
export class UsersService {
	constructor(private readonly prismaService: PrismaService) {}

	create(createUserDto: CreateUserDto) {
		return this.prismaService.user.create({
			data: {
				...createUserDto,
				password: bcrypt.hashSync(createUserDto.password, 10 /* Salt*/),
				role: createUserDto.role.toUpperCase() as Roles,
			},
		})
	}

	findAll() {
		return this.prismaService.user.findMany()
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
		return this.prismaService.user.update({
			where: { id },
			data: {
				...updateUserDto,
				password: updateUserDto.password
					? bcrypt.hashSync(updateUserDto.password, 10 /* Salt*/)
					: undefined,
				role: updateUserDto.role ? (updateUserDto.role.toUpperCase() as Roles) : undefined,
			},
		})
	}

	remove(id: string) {
		return this.prismaService.user.delete({
			where: { id },
		})
	}
}
