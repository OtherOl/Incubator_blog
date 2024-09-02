import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PostsQueryRepository } from '../repositories/posts.query-repository';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';
import { PostsRepository } from '../repositories/posts.repository';
import { commentsModel, createCommentModel } from '../../common/types/comments.model';
import { Comment } from '../../comments/domain/comments.entity';

@Injectable()
export class CreateCommentUseCase {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postsRepository: PostsRepository,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async createComment(postId: string, content: createCommentModel, userId: string) {
    const post = await this.postsQueryRepository.getPostByIdSQL(postId);
    const user = await this.usersQueryRepository.getUserById(userId);
    if (!post) throw new NotFoundException("Post doesn't exists");
    if (!user) throw new UnauthorizedException();
    const comment: commentsModel = Comment.createNewComment(postId, content, user.id, user.login);
    return await this.postsRepository.createComment(comment);
  }
}
