import { Injectable } from '@nestjs/common';
import { LikesQueryRepository } from '../../likes/repositories/likes.query-repository';
import { LikesService } from '../../likes/application/likes.service';
import { CommentsRepository } from '../repositories/comments.repository';
import { LikesRepository } from '../../likes/repositories/likes.repository';
import { CommentViewModel } from '../../base/types/comments.model';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';

@Injectable()
export class DoLikesUseCase {
  constructor(
    private likesQueryRepository: LikesQueryRepository,
    private likesRepository: LikesRepository,
    private likesService: LikesService,
    private commentsRepository: CommentsRepository,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async doLikes(userId: string, comment: CommentViewModel, likeStatus: string) {
    const like = await this.likesQueryRepository.getLikeByCommentId(userId, comment.id);
    const user = await this.usersQueryRepository.getUserById(userId);
    if (likeStatus === 'Like') {
      if (!like) {
        await this.likesService.createNewCommentLike(userId, comment.id, 'Like', user!.login);
        await this.commentsRepository.addLike(comment.id);
        return;
      }
      if (like.type === 'Dislike') {
        await this.likesRepository.updateLike(like.id, 'Like');
        await this.commentsRepository.decreaseDislike(comment.id);
        await this.commentsRepository.addLike(comment.id);
        return;
      }
      if (like.type === 'None') {
        await this.likesRepository.updateLike(like.id, 'Like');
        await this.commentsRepository.addLike(comment.id);
        return;
      }
    }

    if (likeStatus === 'Dislike') {
      if (!like) {
        await this.likesService.createNewCommentLike(userId, comment.id, 'Dislike', user!.login);
        await this.commentsRepository.addDislike(comment.id);
        return;
      }
      if (like.type === 'Like') {
        await this.likesRepository.updateLike(like.id, 'Dislike');
        await this.commentsRepository.decreaseLike(comment.id);
        await this.commentsRepository.addDislike(comment.id);
        return;
      }
      if (like.type === 'None') {
        await this.likesRepository.updateLike(like.id, 'Dislike');
        await this.commentsRepository.addDislike(comment.id);
        return;
      }
    }

    if (likeStatus === 'None') {
      if (!like) return;
      if (like.type === 'Like') {
        await this.likesRepository.updateLike(like.id, 'None');
        await this.commentsRepository.decreaseLike(comment.id);
        return;
      }
      if (like.type === 'Dislike') {
        await this.likesRepository.updateLike(like.id, 'None');
        await this.commentsRepository.decreaseDislike(comment.id);
        return;
      }
    }
  }
}
