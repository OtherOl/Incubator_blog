import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Likes } from '../entities/likes.entity';

@Injectable()
export class LikesQueryRepository {
  constructor(@InjectRepository(Likes) private likesRepository: Repository<Likes>) {}

  async getLikeByCommentId(userId: string, commentId: string): Promise<Likes | null> {
    return await this.likesRepository.findOneBy({ userId, commentId });
  }

  async getLikeByUserId(userId: string): Promise<Likes[] | null> {
    return await this.likesRepository.findBy({ userId });
  }

  async getLikeByPostId(userId: string, postId: string): Promise<Likes | null> {
    return await this.likesRepository.findOneBy({ userId, postId });
  }

  async getNewestLikes(type: string): Promise<Likes[] | null> {
    return await this.likesRepository
      .createQueryBuilder('l')
      .select()
      .where('l.postId IS NOT NULL')
      .andWhere('l.type = :type', { type })
      .orderBy('l.addedAt', 'DESC')
      .getMany();
  }

  async getNewestLikeForCurrentPost(postId: string, type: string): Promise<Likes[] | null> {
    return await this.likesRepository
      .createQueryBuilder('l')
      .select(['l.addedAt', 'l.userId', 'l.login'])
      .where('l.postId = :postId', { postId })
      .andWhere('l.type = :type', { type })
      .orderBy('l.addedAt', 'DESC')
      .getMany();
    // return await this.likesRepository
    //   .createQueryBuilder('l')
    //   .select(['l.addedAt', 'l.userId', 'l.login'])
    //   .where('l.postId = :postId', { postId })
    //   .andWhere('l.type = :type', { type })
    //   .orderBy('l.addedAt', 'DESC')
    //   .limit(3)
    //   .getMany();
  }
}
