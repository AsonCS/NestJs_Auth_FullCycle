import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { AuthGuard } from 'src/auth/auth.guard'
import { Request } from 'express'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(AuthGuard)
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

	@UseGuards(AuthGuard)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.usersService.remove(id)
	}
}
