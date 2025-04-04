import { Global, Module } from '@nestjs/common'
import { CaslAbilityService } from './casl.ability/casl.ability.service'

@Global()
@Module({
	exports: [CaslAbilityService],
	providers: [CaslAbilityService],
})
export class CaslModule {}
