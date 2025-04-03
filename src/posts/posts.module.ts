import { Module } from '@nestjs/common'
import { PostsService } from './posts.service'
import { PostsController } from './posts.controller'
import { UsersModule } from 'src/users/users.module'

@Module({
	controllers: [PostsController],
	imports: [UsersModule],
	providers: [PostsService],
})
export class PostsModule {}
