import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Comment } from '../domain/comments.entity';

@Injectable()
export class CommentsRepository {
  constructor(@InjectRepository(Comment) private commentsRepository: Repository<Comment>) {}

  async updateComment(commentId: string, content: string): Promise<UpdateResult> {
    return await this.commentsRepository.update({ id: commentId }, { content });
  }

  async deleteComment(commentId: string): Promise<DeleteResult> {
    return await this.commentsRepository.delete({ id: commentId });
  }

  async addLike(commentId: string): Promise<UpdateResult> {
    return await this.commentsRepository
      .createQueryBuilder()
      .update(Comment)
      .set({
        likesInfo: () =>
          `jsonb_set("likesInfo", '{likesCount}', (COALESCE("likesInfo"->>'likesCount','0')::int + 1)::text::jsonb)`,
      })
      .where('id = :id', { id: commentId })
      .execute();
  }

  async decreaseLike(commentId: string): Promise<UpdateResult> {
    return await this.commentsRepository
      .createQueryBuilder()
      .update(Comment)
      .set({
        likesInfo: () =>
          `jsonb_set("likesInfo", '{likesCount}', (COALESCE("likesInfo"->>'likesCount','0')::int - 1)::text::jsonb)`,
      })
      .where('id = :id', { id: commentId })
      .execute();
  }

  async addDislike(commentId: string): Promise<UpdateResult> {
    return await this.commentsRepository
      .createQueryBuilder()
      .update(Comment)
      .set({
        likesInfo: () =>
          `jsonb_set("likesInfo", '{dislikesCount}', (COALESCE("likesInfo"->>'dislikesCount','0')::int + 1)::text::jsonb)`,
      })
      .where('id = :id', { id: commentId })
      .execute();
  }

  async decreaseDislike(commentId: string): Promise<UpdateResult> {
    return await this.commentsRepository
      .createQueryBuilder()
      .update(Comment)
      .set({
        likesInfo: () =>
          `jsonb_set("likesInfo", '{dislikesCount}', (COALESCE("likesInfo"->>'dislikesCount','0')::int - 1)::text::jsonb)`,
      })
      .where('id = :id', { id: commentId })
      .execute();
  }
}
