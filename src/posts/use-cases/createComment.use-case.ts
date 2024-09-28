import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PostsQueryRepository } from '../repositories/posts.query-repository';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';
import { PostsRepository } from '../repositories/posts.repository';
import { commentsModel, createCommentModel } from '../../common/types/comments.model';
import { Comment } from '../../comments/entites/comments.entity';
import { BlogsQueryRepository } from '../../blogs/repositories/blogs.query-repository';
import { BannedUsersQueryRepository } from '../../blogger/repositories/bannedUsers.query-repository';

@Injectable()
export class CreateCommentUseCase {
  constructor(
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postsRepository: PostsRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly blogsQueryRepo: BlogsQueryRepository,
    private readonly bannedUsersQueryRepo: BannedUsersQueryRepository,
  ) {}

  async createComment(postId: string, content: createCommentModel, userId: string) {
    const post = await this.postsQueryRepository.getPostByIdSQL(postId);
    const user = await this.usersQueryRepository.getUserById(userId);
    if (!post) throw new NotFoundException("Post doesn't exists");
    if (!user) throw new UnauthorizedException();

    const blog = await this.blogsQueryRepo.getBlogById(post.blogId);
    const isBanned = await this.bannedUsersQueryRepo.isExists(user.id, blog!.id);
    if (isBanned) throw new ForbiddenException();

    const comment: commentsModel = Comment.createNewComment(postId, content, user.id, user.login);
    return await this.postsRepository.createComment(comment);
  }
}
