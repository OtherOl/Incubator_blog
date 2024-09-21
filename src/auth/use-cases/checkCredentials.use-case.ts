import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';
import { UserLogin } from '../../common/types/users.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CheckCredentialsUseCase {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async checkCredentials(inputData: UserLogin) {
    const foundedUser = await this.usersQueryRepository.findByLoginOrEmail(inputData.loginOrEmail);
    if (!foundedUser) throw new UnauthorizedException();
    if (!foundedUser.isConfirmed) throw new UnauthorizedException();
    if (foundedUser.banInfo.isBanned) throw new UnauthorizedException();
    const comparePassword = await bcrypt.compare(inputData.password, foundedUser.passwordHash);

    if (!comparePassword) throw new UnauthorizedException();
    return foundedUser;
  }
}
