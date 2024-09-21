import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';
import { PostsRepository } from '../../posts/repositories/posts.repository';
import { createBlogPostModel } from '../../common/types/posts.model';
import { Post } from '../../posts/domain/posts.entity';

@Injectable()
export class CreatePostForBlogUseCase {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async createPostForBlog(blogId: string, inputData: createBlogPostModel, userId?: string) {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);
    if (!blog) throw new NotFoundException("Blog doesn't exists");
    let newPost: Post;

    if (!userId) {
      newPost = Post.createNewPost(
        inputData.title,
        inputData.shortDescription,
        inputData.content,
        blog.id,
        blog.name,
      );
    } else {
      const isBelong = await this.blogsQueryRepository.getBlogByIdAndUserId(blog.id, userId);
      if (!isBelong) throw new ForbiddenException("Blog doesn't belong to you");
      newPost = Post.createNewPost(
        inputData.title,
        inputData.shortDescription,
        inputData.content,
        blog.id,
        blog.name,
      );
    }
    return await this.postsRepository.createPost(newPost);
  }
}
