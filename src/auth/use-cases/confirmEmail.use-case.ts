import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';
import { UsersRepository } from '../../users/repositories/users.repository';
import { ConfirmationCode } from '../../common/types/users.model';

@Injectable()
export class ConfirmEmailUseCase {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersRepository: UsersRepository,
  ) {}

  async confirmEmail(code: ConfirmationCode) {
    const user = await this.usersQueryRepository.findUserByConfirmationCode(code);
    if (!user) throw new BadRequestException([{ message: 'User not found', field: 'code' }]);
    if (user.isConfirmed)
      throw new BadRequestException([{ message: 'User already confirmed', field: 'code' }]);
    if (user.emailConfirmation.confirmationCode !== code.code)
      throw new BadRequestException([{ message: 'Invalid confirmationCode', field: 'code' }]);
    if (user.emailConfirmation.expirationDate < new Date().toISOString())
      throw new BadRequestException([{ message: 'expirationDate expired', field: 'code' }]);

    return await this.usersRepository.updateConfirmation(user.id);
  }
}
