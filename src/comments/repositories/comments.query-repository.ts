import { Injectable, NotFoundException } from '@nestjs/common';
import { LikesQueryRepository } from '../../likes/repositories/likes.query-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entites/comments.entity';
import { CommentViewModel } from '../../common/types/comments.model';
import { IsBannedForCommentsUseCase } from '../use-cases/isBannedForComments.use-case';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectRepository(Comment) private readonly commentsRepository: Repository<Comment>,
    private readonly likesQueryRepository: LikesQueryRepository,
    private readonly isBannedForCommentsUseCase: IsBannedForCommentsUseCase,
  ) {}

  async getCommentByIdService(id: string, userId: string): Promise<CommentViewModel> {
    const comment = await this.commentsRepository.findOneBy({ id });
    if (!comment) throw new NotFoundException("Comment doesn't exists");
    await this.isBannedForCommentsUseCase.check(comment.commentatorInfo.userId);

    let likeStatus: string;

    const like = await this.likesQueryRepository.getLikeByCommentId(userId, comment.id);
    if (!like) {
      likeStatus = 'None';
    } else {
      likeStatus = like.type;
    }
    return {
      id: comment.id,
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus: likeStatus,
      },
    };
  }

  async getCommentById(id: string): Promise<CommentViewModel> {
    const comment = await this.commentsRepository.findOneBy({ id });
    if (!comment) throw new NotFoundException("Comment doesn't exists");

    return {
      id: comment.id,
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus: comment.likesInfo.myStatus,
      },
    };
  }
}
