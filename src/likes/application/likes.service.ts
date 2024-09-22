import { Injectable } from '@nestjs/common';
import { Likes } from '../entities/likes.entity';
import { LikesRepository } from '../repositories/likes.repository';

@Injectable()
export class LikesService {
  constructor(private likesRepository: LikesRepository) {}

  async createNewCommentLike(userId: string, commentId: string, type: string, login: string) {
    const like = Likes.createCommentLike(userId, commentId, type, login);
    await this.likesRepository.createCommentLike(like);
    return like;
  }

  async createNewPostLike(userId: string, postId: string, type: string, userLogin: string) {
    const like = Likes.createPostLike(userId, postId, type, userLogin);
    await this.likesRepository.createPostLike(like);
    return like;
  }
}
