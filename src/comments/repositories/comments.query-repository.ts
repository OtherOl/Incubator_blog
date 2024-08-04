import { Injectable, NotFoundException } from '@nestjs/common';
import { LikesQueryRepository } from '../../likes/repositories/likes.query-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../domain/comments.entity';
import { CommentViewModel } from '../../base/types/comments.model';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
    private likesQueryRepository: LikesQueryRepository,
  ) {}

  async getCommentByIdService(id: string, userId: string): Promise<CommentViewModel> {
    const comment = await this.commentsRepository.findOneBy({ id });
    if (!comment) throw new NotFoundException("Comment doesn't exists");

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
