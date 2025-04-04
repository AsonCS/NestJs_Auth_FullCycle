import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
	await prisma.user.upsert({
		where: { id: 'cm92hdtz50000ta50g5l7zhjc' },
		update: {},
		create: {
			id: 'cm92hdtz50000ta50g5l7zhjc',
			email: 'admin@user.com',
			name: 'Admin',
			password: '$2b$10$zC4kdOlEyzfgCUQTJI87FOKhmbULg0DP.hCPt8.2iyAQ3RTNCWNv6',
			permissions: [
				{
					action: 'manage',
					resource: 'all',
				},
			],
			role: 'ADMIN',
		},
	})
	await prisma.post.createMany({
		data: [
			{
				title: 'Post 1',
				content: 'Content 1',
				published: true,
				authorId: 'cm92hdtz50000ta50g5l7zhjc',
			},
			{
				title: 'Post 2',
				content: 'Content 2',
				published: false,
				authorId: 'cm92hdtz50000ta50g5l7zhjc',
			},
			{
				title: 'Post 3',
				content: 'Content 3',
				published: true,
				authorId: 'cm92hdtz50000ta50g5l7zhjc',
			},
		],
	})
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
	})
