import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';
import { BlogsQueryRepository } from '../../blogs/repositories/blogs.query-repository';

@Injectable()
export class IsBannedForPostUseCase {
  constructor(
    private readonly usersQueryRepo: UsersQueryRepository,
    private readonly blogsQueryRepo: BlogsQueryRepository,
  ) {}

  async check(blogId: string) {
    const blog = await this.blogsQueryRepo.getFullBlogInfo(blogId);
    if (blog?.banInfo.isBanned) throw new NotFoundException();
    if (!blog?.blogOwnerInfo.userId) return;
    const user = await this.usersQueryRepo.getFullUserInfoById(blog?.blogOwnerInfo.userId);
    if (user?.banInfo.isBanned) throw new NotFoundException();
    return;
  }
}
