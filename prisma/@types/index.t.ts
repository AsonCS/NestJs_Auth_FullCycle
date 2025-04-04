/* eslint-disable @typescript-eslint/no-namespace */
import type { PermActions, PermResources } from '../../src/casl/casl.ability/casl.ability.service'

declare global {
	namespace PrismaJson {
		type PermList = Array<{
			action: PermActions
			resource: PermResources
			condition?: Record<string, any>
		}>
	}
}
