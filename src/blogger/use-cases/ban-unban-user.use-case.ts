import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BlogsQueryRepository } from '../../blogs/repositories/blogs.query-repository';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';
import { BannedUsersEntity } from '../entities/bannedUsers.entity';
import { BannedUsersRepository } from '../repositories/bannedUsers.repository';
import { BannedUsersQueryRepository } from '../repositories/bannedUsers.query-repository';

@Injectable()
export class BanUnbanUserUseCase {
  constructor(
    private readonly blogsQueryRepo: BlogsQueryRepository,
    private readonly usersQueryRepo: UsersQueryRepository,
    private readonly bannedUsersRepo: BannedUsersRepository,
    private readonly bannedUsersQueryRepo: BannedUsersQueryRepository,
  ) {}

  async banUnbanUser(
    blogOwnerId: string,
    userId: string,
    blogId: string,
    isBanned: boolean,
    banReason: string,
  ) {
    const blog = await this.blogsQueryRepo.getBlogByAdmin(blogId);
    if (!blog) throw new NotFoundException("Blog doesn't exists");
    if (blog.blogOwnerInfo.userId !== blogOwnerId) throw new ForbiddenException("Blog doesn't belong to you");

    const user = await this.usersQueryRepo.getUserById(userId);
    if (!user) throw new NotFoundException("User doesn't exists");
    const bannedUser = await this.bannedUsersQueryRepo.getBannedUserByUserIdAndBlogId(user.id, blog.id);
    if (!bannedUser) {
      const newBannedUser = BannedUsersEntity.createBannedUser(user.id, user.login, blog.id);
      await this.bannedUsersRepo.addBannedUser(newBannedUser);
      await this.bannedUsersRepo.banUnbanUser(newBannedUser.id, isBanned, banReason);
      return;
    } else {
      await this.bannedUsersRepo.banUnbanUser(bannedUser.id, isBanned, banReason);
      return;
    }
  }
}
