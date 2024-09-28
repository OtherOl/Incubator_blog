import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BannedUsersEntity } from '../entities/bannedUsers.entity';
import { Repository } from 'typeorm';
import { sortDirectionHelper } from '../../common/helpers/sortDirection.helper';

@Injectable()
export class BannedUsersQueryRepository {
  constructor(
    @InjectRepository(BannedUsersEntity) private readonly bannedUsersRepo: Repository<BannedUsersEntity>,
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
  ) {
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
      .select(['b.id', 'b.login', 'b.banInfo'])
      .where({ blogId })
      .andWhere('b.login ilike :login', { login: `%${searchLoginTerm}%` })
      .andWhere("b.banInfo ->> 'isBanned' = :isBanned", { isBanned: true })
      .orderBy(`b.${sortBy}`, sortDir)
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .getMany();

    return {
      pagesCount: Math.ceil(Number(countUsers / pageSize)),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: +countUsers,
      items: bannedUsers,
    };
  }
}
