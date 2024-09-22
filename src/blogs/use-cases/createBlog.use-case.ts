import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../repositories/blogs.repository';
import { adminBlogViewModel, createBlogModel } from '../../common/types/blogs.model';
import { Blog } from '../entities/blogs.entity';

@Injectable()
export class CreateBlogUseCase {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async createBlog(inputData: createBlogModel, userId?: string, login?: string) {
    let newBlog: adminBlogViewModel;
    if (!userId) {
      newBlog = Blog.createNewBlog(inputData);
    } else {
      newBlog = Blog.createNewBlog(inputData, userId, login);
    }

    return this.blogsRepository.createBlog(newBlog);
  }
}
