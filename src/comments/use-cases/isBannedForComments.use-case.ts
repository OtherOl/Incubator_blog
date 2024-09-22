import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';

@Injectable()
export class IsBannedForCommentsUseCase {
  constructor(private readonly usersQueryRepo: UsersQueryRepository) {}

  async check(userId: string) {
    const user = await this.usersQueryRepo.getFullUserInfoById(userId);
    if (user?.banInfo.isBanned) throw new NotFoundException();
    return;
  }
}
