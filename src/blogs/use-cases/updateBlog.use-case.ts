import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../repositories/blogs.repository';
import { createBlogModel } from '../../common/types/blogs.model';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';

@Injectable()
export class UpdateBlogUseCase {
  constructor(
    private blogsRepository: BlogsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async updateBlog(blogId: string, inputData: createBlogModel, userId?: string) {
    if (!userId) {
      const blog = await this.blogsQueryRepository.getBlogById(blogId);
      if (!blog) throw new NotFoundException("Blog doesn't exists");
      return this.blogsRepository.updateBlog(blog.id, inputData);
    } else {
      const blog = await this.blogsQueryRepository.getBlogByIdAndUserId(blogId, userId);
      //403 потому что в тестах так :/ (тупая херня)
      if (!blog) throw new NotFoundException("Blog doesn't belong to you");
      return this.blogsRepository.updateBlog(blog.id, inputData);
    }
  }
}
