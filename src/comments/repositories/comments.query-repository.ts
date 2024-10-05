import { Injectable, NotFoundException } from '@nestjs/common';
import { LikesQueryRepository } from '../../likes/repositories/likes.query-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entites/comments.entity';
import { CommentViewModel } from '../../common/types/comments.model';
import { IsBannedForCommentsUseCase } from '../use-cases/isBannedForComments.use-case';
import { Likes } from '../../likes/entities/likes.entity';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';
import { LikesEnum } from '../../common/types/likes.model';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectRepository(Comment) private readonly commentsRepository: Repository<Comment>,
    private readonly likesQueryRepository: LikesQueryRepository,
    private readonly isBannedForCommentsUseCase: IsBannedForCommentsUseCase,
    private readonly usersQueryRepo: UsersQueryRepository,
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
    const allLikes = await this.likesQueryRepository.getLikesByCommentId(comment.id);
    const blackLikes: Likes[] = [];
    if (allLikes.length > 0) {
      for (const like of allLikes) {
        const user = await this.usersQueryRepo.getFullUserInfoById(like.userId);
        if (user?.banInfo.isBanned) {
          blackLikes.push(like);
        }
      }
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
        likesCount: comment.likesInfo.likesCount - blackLikes.length,
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

  async getAllComments(
    userId: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string = 'createdAt',
    sortDirection: 'ASC' | 'DESC',
  ) {
    const countComments = await this.commentsRepository
      .createQueryBuilder('comment')
      .innerJoin('comment.postsId', 'post')
      .innerJoin('post.blogsId', 'blog')
      .where(`blog.blogOwnerInfo ->> 'userId' = :userId`, { userId })
      .andWhere(`blog.banInfo ->> 'isBanned' = :isBanned`, { isBanned: false })
      .andWhere('post.id is not NULL')
      .select([
        'comment.id',
        'comment.content',
        'comment.commentatorInfo',
        'comment.createdAt',
        'comment.likesInfo',
      ])
      .addSelect(['post.id', 'post.title', 'post.blogId', 'post.blogName'])
      .getCount();

    const comments = await this.commentsRepository
      .createQueryBuilder('comment')
      .innerJoin('comment.postsId', 'post')
      .innerJoin('post.blogsId', 'blog')
      .where(`blog.blogOwnerInfo ->> 'userId' = :userId`, { userId })
      .andWhere(`blog.banInfo ->> 'isBanned' = :isBanned`, { isBanned: false })
      .andWhere('post.id is not NULL')
      .select([
        'comment.id',
        'comment.content',
        'comment.commentatorInfo',
        'comment.createdAt',
        'comment.likesInfo',
      ])
      .addSelect(['post.id', 'post.title', 'post.blogId', 'post.blogName'])
      .orderBy(`comment.${sortBy}`, sortDirection)
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .getMany();

    const updatedComments = await Promise.all(
      comments.map(async (comment) => {
        let likeStatus: string;
        const like = await this.likesQueryRepository.getLikeByCommentId(userId, comment.id);
        like ? (likeStatus = like.type) : (likeStatus = LikesEnum.None);
        return {
          ...comment,
          likesInfo: {
            myStatus: likeStatus,
            likesCount: comment.likesInfo.likesCount,
            dislikesCount: comment.likesInfo.dislikesCount,
          },
          postInfo: comment.postsId,
          postsId: undefined,
        };
      }),
    );

    return {
      pagesCount: Math.ceil(Number(countComments / pageSize)),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: countComments,
      items: updatedComments,
    };
  }
}
