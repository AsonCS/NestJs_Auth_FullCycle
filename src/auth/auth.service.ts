import { Injectable } from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from 'src/users/users.service'
import bcrypt from 'bcrypt'
import { InvalidCredentials } from 'src/_model/erros/InvalidCredentials'
import { AccessTokenDto } from './dto/accessToken.dto'
import { CaslAbilityService } from 'src/casl/casl.ability/casl.ability.service'
import { packRules } from '@casl/ability/extra'

@Injectable()
export class AuthService {
	constructor(
		private readonly caslAbilityService: CaslAbilityService,
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

		const ability = this.caslAbilityService.createForUser(user)
		const token = this.jwtService.sign(
			AccessTokenDto({ ...user, permissions: packRules(ability.rules) })
		)
		return { access_token: token }
	}
}
