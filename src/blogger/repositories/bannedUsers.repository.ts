import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BannedUsersEntity } from '../entities/bannedUsers.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BannedUsersRepository {
  constructor(
    @InjectRepository(BannedUsersEntity) private readonly bannedUsersRepo: Repository<BannedUsersEntity>,
  ) {}

  async addBannedUser(user: BannedUsersEntity) {
    return await this.bannedUsersRepo.insert(user);
  }

  async banUnbanUser(id: string, isBanned: boolean, banReason: string) {
    await this.bannedUsersRepo
      .createQueryBuilder()
      .update(BannedUsersEntity)
      .set({ banInfo: () => `jsonb_set("banInfo", '{isBanned}', '${isBanned}')` })
      .where('id = :id', { id })
      .execute();

    await this.bannedUsersRepo
      .createQueryBuilder()
      .update(BannedUsersEntity)
      .set({
        banInfo: () =>
          `jsonb_set("banInfo", '{banDate}', '${isBanned ? `"${new Date().toISOString()}"` : null}')`,
      })
      .where('id = :id', { id })
      .execute();

    return await this.bannedUsersRepo
      .createQueryBuilder()
      .update(BannedUsersEntity)
      .set({
        banInfo: () => `jsonb_set("banInfo", '{banReason}', '${isBanned ? `"${banReason}"` : null}')`,
      })
      .where('id = :id', { id })
      .execute();
  }
}
