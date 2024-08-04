import { ForbiddenException, Injectable } from '@nestjs/common';
import { CommentsQueryRepository } from '../repositories/comments.query-repository';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';
import { CommentsRepository } from '../repositories/comments.repository';

@Injectable()
export class UpdateCommentUseCase {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsRepository: CommentsRepository,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async updateComment(commentId: string, content: string, userId: string) {
    const user = await this.usersQueryRepository.getUserById(userId);
    const comment = await this.commentsQueryRepository.getCommentById(commentId);
    if (user!.id !== comment.commentatorInfo.userId) throw new ForbiddenException();
    await this.commentsRepository.updateComment(commentId, content);
    return;
  }
}
