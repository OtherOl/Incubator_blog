import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';
import { PostsRepository } from '../../posts/repositories/posts.repository';
import { createBlogPostModel } from '../../base/types/posts.model';
import { Post } from '../../posts/domain/posts.entity';

@Injectable()
export class CreatePostForBlogUseCase {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsRepository: PostsRepository,
  ) {}

  async createPostForBlog(blogId: string, inputData: createBlogPostModel) {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);
    if (!blog) throw new NotFoundException("Blog doesn't exists");

    const newPost = Post.createNewPost(
      inputData.title,
      inputData.shortDescription,
      inputData.content,
      blog.id,
      blog.name,
    );

    return this.postsRepository.createPost(newPost);
  }
}
