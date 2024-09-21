import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';
import { BlogsRepository } from '../repositories/blogs.repository';

@Injectable()
export class DeleteBlogUseCase {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async deleteBlogById(blogId: string, userId?: string) {
    if (!userId) {
      const blog = await this.blogsQueryRepository.getBlogById(blogId);
      if (!blog) throw new NotFoundException("Blog doesn't exists");
      await this.blogsRepository.deleteBlogById(blog.id);
      return;
    } else {
      const blog = await this.blogsQueryRepository.getBlogById(blogId);
      if (!blog) throw new NotFoundException("Blog doesn't exists");
      const isBelong = await this.blogsQueryRepository.getBlogByIdAndUserId(blog.id, userId);
      if (!isBelong) throw new ForbiddenException("Blog doesn't belong to you");
      await this.blogsRepository.deleteBlogById(isBelong.id);
      return;
    }
  }
}
