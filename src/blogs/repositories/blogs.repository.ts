import { Injectable } from '@nestjs/common';
import { adminBlogViewModel, blogViewModel, createBlogModel } from '../../common/types/blogs.model';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Blog } from '../entities/blogs.entity';

@Injectable()
export class BlogsRepository {
  constructor(@InjectRepository(Blog) private blogsRepository: Repository<Blog>) {}

  async createBlog(blog: adminBlogViewModel): Promise<blogViewModel> {
    await this.blogsRepository.insert(blog);
    return {
      id: blog.id,
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
  }
  async updateBlog(blogId: string, inputData: createBlogModel): Promise<UpdateResult> {
    return await this.blogsRepository.update({ id: blogId }, inputData);
  }

  async deleteBlogById(blogId: string): Promise<DeleteResult> {
    return await this.blogsRepository.delete({ id: blogId });
  }

  async updateBlogOwnerInfo(blogId: string, userId: string, userLogin: string) {
    await this.blogsRepository
      .createQueryBuilder()
      .update(Blog)
      .set({
        blogOwnerInfo: () => `jsonb_set("blogOwnerInfo", '{userId}', '"${userId}"')`,
      })
      .where('id = :blogId', { blogId })
      .execute();

    return await this.blogsRepository
      .createQueryBuilder()
      .update(Blog)
      .set({
        blogOwnerInfo: () => `jsonb_set("blogOwnerInfo", '{userLogin}', '"${userLogin}"')`,
      })
      .where('id = :blogId', { blogId })
      .execute();
  }

  async banUnbanBlog(blogId: string, isBanned: boolean) {
    await this.blogsRepository
      .createQueryBuilder()
      .update(Blog)
      .set({
        banInfo: () => `jsonb_set("banInfo", '{isBanned}', '${isBanned}')`,
      })
      .where('id = :blogId', { blogId })
      .execute();

    return await this.blogsRepository
      .createQueryBuilder()
      .update(Blog)
      .set({
        banInfo: () =>
          `jsonb_set("banInfo", '{banDate}', '${isBanned ? `"${new Date().toISOString()}"` : null}')`,
      })
      .where('id = :blogId', { blogId })
      .execute();
  }
}
