import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';
import { BlogsRepository } from '../repositories/blogs.repository';

@Injectable()
export class UpdateBlogOwnerUseCase {
  constructor(
    private readonly blogsQueryRepo: BlogsQueryRepository,
    private readonly blogsRepo: BlogsRepository,
    private readonly usersQueryRepo: UsersQueryRepository,
  ) {}

  async update(blogId: string, userId: string) {
    const blog = await this.blogsQueryRepo.getBlogByAdmin(blogId);
    if (!blog) throw new NotFoundException("Blog doesn't exists");
    const user = await this.usersQueryRepo.getUserById(userId);
    if (!user) throw new NotFoundException("User doesn't exists");
    if (blog.blogOwnerInfo.userId !== null) throw new BadRequestException(['Blog already belong to user']);
    return await this.blogsRepo.updateBlogOwnerInfo(blogId, user.id, user.login);
  }
}
