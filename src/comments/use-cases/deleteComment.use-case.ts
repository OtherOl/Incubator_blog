import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';
import { CommentsQueryRepository } from '../repositories/comments.query-repository';
import { CommentsRepository } from '../repositories/comments.repository';

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsRepository: CommentsRepository,
  ) {}

  async deleteComment(commentId: string, userId: string) {
    const user = await this.usersQueryRepository.getUserById(userId);
    const comment = await this.commentsQueryRepository.getCommentById(commentId);
    if (!comment) throw new NotFoundException("Comment doesn't exists");
    if (user!.id !== comment.commentatorInfo.userId) throw new ForbiddenException();
    return await this.commentsRepository.deleteComment(comment.id);
  }
}
