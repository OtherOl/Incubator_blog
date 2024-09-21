import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { createBlogPostModel } from '../../common/types/posts.model';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';
import { PostsQueryRepository } from '../../posts/repositories/posts.query-repository';
import { PostsRepository } from '../../posts/repositories/posts.repository';

@Injectable()
export class UpdatePostByBlogIdUseCase {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
    private postsRepository: PostsRepository,
  ) {}

  async updatePost(blogId: string, postId: string, inputData: createBlogPostModel, userId?: string) {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);
    if (!blog) throw new NotFoundException("Blog doesn't exists");
    const post = await this.postsQueryRepository.getPostByIdSQL(postId);
    if (!post) throw new NotFoundException("Post doesn't exists");
    const isExists = await this.postsQueryRepository.getPostByBlogId(blogId);
    if (!isExists) throw new NotFoundException("Post doesn't exists");
    if (userId) {
      const isBelong = await this.blogsQueryRepository.getBlogByIdAndUserId(blog.id, userId);
      if (!isBelong) throw new ForbiddenException("Blog doesn't belong to you");
    }
    return await this.postsRepository.updatePost(postId, inputData);
  }
}
