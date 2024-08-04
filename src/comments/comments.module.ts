import { Module } from '@nestjs/common';
import { CommentsController } from './controller/comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './domain/comments.entity';
import { CommentsRepository } from './repositories/comments.repository';
import { CommentsQueryRepository } from './repositories/comments.query-repository';
import { DeleteCommentUseCase } from './use-cases/deleteComment.use-case';
import { DoLikesUseCase } from './use-cases/doLikes.use-case';
import { UpdateCommentUseCase } from './use-cases/updateComment.use-case';
import { AuthService } from '../auth/application/auth.service';
import { LikesQueryRepository } from '../likes/repositories/likes.query-repository';
import { UsersQueryRepository } from '../users/repositories/users.query-repository';
import { LikesRepository } from '../likes/repositories/likes.repository';
import { LikesService } from '../likes/application/likes.service';
import { Likes } from '../likes/domain/likes.entity';
import { User } from '../users/domain/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Likes, User])],
  controllers: [CommentsController],
  providers: [
    CommentsRepository,
    CommentsQueryRepository,
    DeleteCommentUseCase,
    DoLikesUseCase,
    UpdateCommentUseCase,
    AuthService,
    LikesQueryRepository,
    LikesRepository,
    LikesService,
    UsersQueryRepository,
  ],
})
export class CommentsModule {}
