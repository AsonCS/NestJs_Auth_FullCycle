import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { AuthGuard } from 'src/auth/auth.guard'
import { Request } from 'express'
import { RoleGuard } from 'src/auth/role/role.guard'
import { RequiredRoles } from 'src/auth/required-roles.decorator'
import { Roles } from '@prisma/client'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(AuthGuard, RoleGuard)
	@RequiredRoles(Roles.ADMIN)
	@Post()
	async create(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
		const newUser = await this.usersService.create(createUserDto)
		return {
			createdBy: req.user,
			...newUser,
		}
	}

	@UseGuards(AuthGuard)
	@Get()
	findAll() {
		return this.usersService.findAll()
	}

	@UseGuards(AuthGuard)
	@Get('/me')
	findMe(@Req() req: Request) {
		console.log(req.user)
		return this.usersService.findOne(req.user!.id)
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.usersService.findOne(id)
	}

	@UseGuards(AuthGuard)
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(id, updateUserDto)
	}

	@UseGuards(AuthGuard, RoleGuard)
	@RequiredRoles(Roles.ADMIN)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.usersService.remove(id)
	}
}
