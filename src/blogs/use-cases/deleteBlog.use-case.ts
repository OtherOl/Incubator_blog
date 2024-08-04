import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';
import { BlogsRepository } from '../repositories/blogs.repository';

@Injectable()
export class DeleteBlogUseCase {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async deleteBlogById(blogId: string) {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);
    if (!blog) throw new NotFoundException("Blog doesn't exists");
    return await this.blogsRepository.deleteBlogById(blog.id);
  }
}
