import { Injectable } from '@nestjs/common';
import { CommentLikes, PostLikes } from '../../common/types/likes.model';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { Likes } from '../domain/likes.entity';

@Injectable()
export class LikesRepository {
  constructor(@InjectRepository(Likes) private likesRepository: Repository<Likes>) {}

  async createCommentLike(like: CommentLikes): Promise<InsertResult> {
    return await this.likesRepository.insert(like);
  }

  async createPostLike(like: PostLikes): Promise<InsertResult> {
    return await this.likesRepository.insert(like);
  }

  async updateLike(likeId: string, type: string): Promise<UpdateResult> {
    return await this.likesRepository.update({ id: likeId }, { type });
  }
}
