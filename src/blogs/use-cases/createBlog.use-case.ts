import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../repositories/blogs.repository';
import { blogViewModel, createBlogModel } from '../../common/types/blogs.model';
import { Blog } from '../domain/blogs.entity';

@Injectable()
export class CreateBlogUseCase {
  constructor(private blogsRepository: BlogsRepository) {}

  async createBlog(inputData: createBlogModel) {
    const newBlog: blogViewModel = Blog.createNewBlog(inputData);

    return this.blogsRepository.createBlog(newBlog);
  }
}
