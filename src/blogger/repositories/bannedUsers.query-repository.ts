import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BannedUsersEntity } from '../entities/bannedUsers.entity';
import { Repository } from 'typeorm';
import { sortDirectionHelper } from '../../common/helpers/sortDirection.helper';
import { Blog } from '../../blogs/entities/blogs.entity';

@Injectable()
export class BannedUsersQueryRepository {
  constructor(
    @InjectRepository(BannedUsersEntity) private readonly bannedUsersRepo: Repository<BannedUsersEntity>,
    @InjectRepository(Blog) private readonly blogsRepo: Repository<Blog>,
  ) {}

  async getBannedUserByUserIdAndBlogId(userId: string, blogId: string) {
    return await this.bannedUsersRepo.findOneBy({ userId, blogId });
  }

  async isExists(userId: string, blogId: string): Promise<boolean> {
    return await this.bannedUsersRepo.existsBy({ userId, blogId });
  }

  async getAllBannedUsers(
    blogId: string,
    searchLoginTerm: string,
    sortBy: string = 'createdAt',
    sortDirection: string = 'DESC',
    pageNumber: number,
    pageSize: number,
    userId: string,
  ) {
    const blog = await this.blogsRepo
      .createQueryBuilder('b')
      .select('b')
      .addSelect('b.blogOwnerInfo')
      .where('id = :id', { id: blogId })
      .getOne();

    if (!blog) throw new NotFoundException();
    if (blog.blogOwnerInfo.userId !== userId) throw new ForbiddenException();

    const isExists = await this.bannedUsersRepo.existsBy({ blogId });
    if (!isExists) throw new NotFoundException();

    const sortDir = sortDirectionHelper(sortDirection);
    const countUsers = await this.bannedUsersRepo
      .createQueryBuilder('b')
      .select()
      .where({ blogId })
      .andWhere('b.login ilike :login', { login: `%${searchLoginTerm}%` })
      .andWhere("b.banInfo ->> 'isBanned' = :isBanned", { isBanned: true })
      .getCount();

    const bannedUsers = await this.bannedUsersRepo
      .createQueryBuilder('b')
      .select('b.userId', 'id')
      .addSelect('b.login', 'login')
      .addSelect('b.banInfo', 'banInfo')
      .where({ blogId })
      .andWhere('b.login ilike :login', { login: `%${searchLoginTerm}%` })
      .andWhere("b.banInfo ->> 'isBanned' = :isBanned", { isBanned: true })
      .orderBy(`b.${sortBy}`, sortDir)
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .getRawMany();

    return {
      pagesCount: Math.ceil(Number(countUsers / pageSize)),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: +countUsers,
      items: bannedUsers,
    };
  }
}
