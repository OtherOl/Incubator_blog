import { Injectable } from '@nestjs/common';
import { createBlogPostModel, postModel } from '../../base/types/posts.model';
import { commentsModel, CommentViewModel } from '../../base/types/comments.model';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Post } from '../domain/posts.entity';
import { Comment } from '../../comments/domain/comments.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
  ) {}

  async createPost(newPost: postModel): Promise<postModel> {
    await this.postsRepository.insert(newPost);
    return newPost;
  }

  async updatePost(postId: string, inputData: createBlogPostModel): Promise<UpdateResult> {
    return await this.postsRepository.update({ id: postId }, inputData);
  }

  async deletePostById(postId: string): Promise<DeleteResult> {
    return await this.postsRepository.delete({ id: postId });
  }

  async createComment(newComment: commentsModel): Promise<CommentViewModel> {
    await this.commentsRepository.insert(newComment);
    return {
      id: newComment.id,
      content: newComment.content,
      commentatorInfo: {
        userId: newComment.commentatorInfo.userId,
        userLogin: newComment.commentatorInfo.userLogin,
      },
      createdAt: newComment.createdAt,
      likesInfo: {
        likesCount: newComment.likesInfo.likesCount,
        dislikesCount: newComment.likesInfo.dislikesCount,
        myStatus: newComment.likesInfo.myStatus,
      },
    };
  }

  async addLike(postId: string): Promise<UpdateResult> {
    return await this.postsRepository
      .createQueryBuilder()
      .update(Post)
      .set({
        extendedLikesInfo: () =>
          `jsonb_set("extendedLikesInfo", '{likesCount}', (COALESCE("extendedLikesInfo"->>'likesCount','0')::int + 1)::text::jsonb)`,
      })
      .where('id = :id', { id: postId })
      .execute();
  }

  async decreaseLike(postId: string): Promise<UpdateResult> {
    return await this.postsRepository
      .createQueryBuilder()
      .update(Post)
      .set({
        extendedLikesInfo: () =>
          `jsonb_set("extendedLikesInfo", '{likesCount}', (COALESCE("extendedLikesInfo"->>'likesCount','0')::int - 1)::text::jsonb)`,
      })
      .where('id = :id', { id: postId })
      .execute();
  }

  async addDislike(postId: string): Promise<UpdateResult> {
    return await this.postsRepository
      .createQueryBuilder()
      .update(Post)
      .set({
        extendedLikesInfo: () =>
          `jsonb_set("extendedLikesInfo", '{dislikesCount}', (COALESCE("extendedLikesInfo"->>'dislikesCount','0')::int + 1)::text::jsonb)`,
      })
      .where('id = :id', { id: postId })
      .execute();
  }

  async decreaseDislike(postId: string): Promise<UpdateResult> {
    return await this.postsRepository
      .createQueryBuilder()
      .update(Post)
      .set({
        extendedLikesInfo: () =>
          `jsonb_set("extendedLikesInfo", '{dislikesCount}', (COALESCE("extendedLikesInfo"->>'dislikesCount','0')::int - 1)::text::jsonb)`,
      })
      .where('id = :id', { id: postId })
      .execute();
  }
}
