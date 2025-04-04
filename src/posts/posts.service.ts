import { Injectable } from '@nestjs/common'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { AppAbility, CaslAbilityService } from 'src/casl/casl.ability/casl.ability.service'
import { accessibleBy } from '@casl/prisma'

@Injectable()
export class PostsService {
	constructor(
		private readonly caslAbilityService: CaslAbilityService,
		private readonly prismaService: PrismaService
	) {}

	public get ability(): AppAbility {
		return this.caslAbilityService.ability
	}

	create(createPostDto: CreatePostDto & { authorId: string }) {
		if (!this.ability.can('create', 'Post')) {
			throw new Error('You are not allowed to create a post')
		}

		return this.prismaService.post.create({
			data: createPostDto,
		})
	}

	findAll() {
		return this.prismaService.post.findMany({
			where: {
				AND: [accessibleBy(this.ability, 'read').Post],
			},
		})
	}

	findOne(id: string) {
		return this.prismaService.post.findUnique({
			where: {
				id,
				AND: [accessibleBy(this.ability, 'read').Post],
			},
		})
	}

	update(id: string, updatePostDto: UpdatePostDto) {
		return this.prismaService.post.update({
			where: { id, AND: [accessibleBy(this.ability, 'update').Post] },
			data: updatePostDto,
		})
	}

	remove(id: string) {
		return this.prismaService.post.delete({
			where: { id, AND: [accessibleBy(this.ability, 'delete').Post] },
		})
	}
}
