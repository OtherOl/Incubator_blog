import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';
import { BlogsRepository } from '../repositories/blogs.repository';

@Injectable()
export class BanUnbanBlogUseCase {
  constructor(
    private readonly blogsQueryRepo: BlogsQueryRepository,
    private readonly blogsRepo: BlogsRepository,
  ) {}

  async banUnban(blogId: string, isBanned: boolean) {
    const blog = await this.blogsQueryRepo.getBlogById(blogId);
    if (!blog) throw new NotFoundException();
    await this.blogsRepo.banUnbanBlog(blog.id, isBanned);
    return;
  }
}
