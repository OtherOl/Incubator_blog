import { Injectable } from '@nestjs/common';
import { LikesQueryRepository } from '../../likes/repositories/likes.query-repository';
import { LikesRepository } from '../../likes/repositories/likes.repository';
import { LikesService } from '../../likes/application/likes.service';
import { PostsRepository } from '../repositories/posts.repository';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';
import { postModel } from '../../common/types/posts.model';

@Injectable()
export class DoPostLikesUseCase {
  constructor(
    private likesQueryRepository: LikesQueryRepository,
    private likesRepository: LikesRepository,
    private likesService: LikesService,
    private postsRepository: PostsRepository,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async doLikes(userId: string, post: postModel, likeStatus: string) {
    const like = await this.likesQueryRepository.getLikeByPostId(userId, post.id);
    const user = await this.usersQueryRepository.getUserById(userId);
    if (likeStatus === 'Like') {
      if (!like) {
        await this.likesService.createNewPostLike(userId, post.id, 'Like', user!.login);
        await this.postsRepository.addLike(post.id);
        return;
      }
      if (like.type === 'Dislike') {
        await this.likesRepository.updateLike(like.id, 'Like');
        await this.postsRepository.decreaseDislike(post.id);
        await this.postsRepository.addLike(post.id);
        return;
      }
      if (like.type === 'None') {
        await this.likesRepository.updateLike(like.id, 'Like');
        await this.postsRepository.addLike(post.id);
        return;
      }
    }
    if (likeStatus === 'Dislike') {
      if (!like) {
        await this.likesService.createNewPostLike(userId, post.id, 'Dislike', user!.login);
        await this.postsRepository.addDislike(post.id);
        return;
      }
      if (like.type === 'Like') {
        await this.likesRepository.updateLike(like.id, 'Dislike');
        await this.postsRepository.decreaseLike(post.id);
        await this.postsRepository.addDislike(post.id);
        return;
      }
      if (like.type === 'None') {
        await this.likesRepository.updateLike(like.id, 'Dislike');
        await this.postsRepository.addDislike(post.id);
        return;
      }
    }
    if (likeStatus === 'None') {
      if (!like) return;
      if (like.type === 'Like') {
        await this.likesRepository.updateLike(like.id, 'None');
        await this.postsRepository.decreaseLike(post.id);
        return;
      }
      if (like.type === 'Dislike') {
        await this.likesRepository.updateLike(like.id, 'None');
        await this.postsRepository.decreaseDislike(post.id);
        return;
      }
    }
  }
}
