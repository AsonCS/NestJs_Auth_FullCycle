export type AccessTokenDto = {
	email: string
	name: string
	sub: string
}

export function AccessTokenDto(source: {
	id: string
	email: string
	name: string
}): AccessTokenDto {
	return {
		email: source.email,
		name: source.name,
		sub: source.id,
	}
}
