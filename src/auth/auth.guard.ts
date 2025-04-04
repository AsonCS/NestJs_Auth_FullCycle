import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { AccessTokenDto } from './dto/accessToken.dto'
import { UsersService } from 'src/users/users.service'
import { User } from '@prisma/client'
import { CaslAbilityService } from 'src/casl/casl.ability/casl.ability.service'

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
		private readonly caslAbilityService: CaslAbilityService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest()
		const token = request.headers['authorization']?.split(' ')[1]

		let payload: AccessTokenDto
		try {
			if (!token) {
				throw Error('Without token')
			}
			payload = this.jwtService.verify<AccessTokenDto>(token, { algorithms: ['HS256'] })
		} catch (e) {
			console.log(e)
			throw new UnauthorizedException('Invalid token', { cause: e })
		}

		let user: User
		try {
			if (!payload.sub) {
				throw Error('Without user id')
			}
			const temp = await this.usersService.findOne(payload.sub)
			if (!temp) {
				throw Error('Without user')
			}
			user = temp
		} catch (e) {
			console.log(e)
			throw new UnauthorizedException('Invalid user token', { cause: e })
		}

		request.user = user
		this.caslAbilityService.createForUser(user)
		return true
	}
}
