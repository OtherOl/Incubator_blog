import { Module } from '@nestjs/common';
import { PostsController } from './controller/posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './domain/posts.entity';
import { PostsQueryRepository } from './repositories/posts.query-repository';
import { PostsRepository } from './repositories/posts.repository';
import { CreateCommentUseCase } from './use-cases/createComment.use-case';
import { DoPostLikesUseCase } from './use-cases/doPostLikes.use-case';
import { AuthService } from '../auth/application/auth.service';
import { UsersQueryRepository } from '../users/repositories/users.query-repository';
import { LikesService } from '../likes/application/likes.service';
import { LikesRepository } from '../likes/repositories/likes.repository';
import { LikesQueryRepository } from '../likes/repositories/likes.query-repository';
import { Comment } from '../comments/domain/comments.entity';
import { User } from '../users/domain/users.entity';
import { Likes } from '../likes/domain/likes.entity';
import { Blog } from '../blogs/domain/blogs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Comment, User, Likes, Blog])],
  controllers: [PostsController],
  providers: [
    PostsQueryRepository,
    PostsRepository,
    CreateCommentUseCase,
    DoPostLikesUseCase,
    AuthService,
    UsersQueryRepository,
    LikesService,
    LikesRepository,
    LikesQueryRepository,
  ],
})
export class PostsModule {}
