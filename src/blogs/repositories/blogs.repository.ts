import { Injectable } from '@nestjs/common';
import { blogViewModel, createBlogModel } from '../../base/types/blogs.model';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Blog } from '../domain/blogs.entity';

@Injectable()
export class BlogsRepository {
  constructor(@InjectRepository(Blog) private blogsRepository: Repository<Blog>) {}

  async createBlog(blog: blogViewModel): Promise<blogViewModel> {
    await this.blogsRepository.insert(blog);
    return blog;
  }
  async updateBlog(blogId: string, inputData: createBlogModel): Promise<UpdateResult> {
    return await this.blogsRepository.update({ id: blogId }, inputData);
  }

  async deleteBlogById(blogId: string): Promise<DeleteResult> {
    return await this.blogsRepository.delete({ id: blogId });
  }
}
