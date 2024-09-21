import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersQueryRepository } from '../repositories/users.query-repository';
import { UsersRepository } from '../repositories/users.repository';
import { AuthWhiteListRepository } from '../../auth/repositories/auth-white_list.repository';
import { SecurityRepository } from '../../security-devices/repositories/security.repository';

@Injectable()
export class BanUserUseCase {
  constructor(
    private readonly usersQueryRepo: UsersQueryRepository,
    private readonly usersRepo: UsersRepository,
    private readonly authWhiteListRepository: AuthWhiteListRepository,
    private readonly securityRepo: SecurityRepository,
  ) {}

  async ban(userId: string, isBanned: boolean, banReason: string) {
    const user = await this.usersQueryRepo.getUserById(userId);
    if (!user) throw new NotFoundException("User doesn't exists");
    await this.usersRepo.banUnbanUser(userId, isBanned, banReason);
    if (isBanned) {
      await this.authWhiteListRepository.deleteAllTokens(userId);
      await this.securityRepo.deleteSessionsByUserId(userId);
    }
    return;
  }
}
