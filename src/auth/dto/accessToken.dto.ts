export type AccessTokenDto = {
	email: string
	name: string
	permissions: any
	role: string
	sub: string
}

export function AccessTokenDto(source: {
	id: string
	email: string
	name: string
	permissions: any
	role: string
}): AccessTokenDto {
	return {
		email: source.email,
		name: source.name,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		permissions: source.permissions,
		sub: source.id,
		role: source.role,
	}
}
