import { Injectable } from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from 'src/users/users.service'
import bcrypt from 'bcrypt'
import { InvalidCredentials } from 'src/_model/erros/InvalidCredentials'
import { AccessTokenDto } from './dto/accessToken.dto'

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService
	) {}

	async login(loginDto: LoginDto) {
		const user = await this.usersService.findOneByEmail(loginDto.email)

		if (!user) {
			throw new InvalidCredentials()
		}

		const isPasswordValid = bcrypt.compareSync(loginDto.password, user.password)

		if (!isPasswordValid) {
			throw new InvalidCredentials()
		}

		const token = this.jwtService.sign(AccessTokenDto(user))
		return { access_token: token }
	}
}
