import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';
import { UsersRepository } from '../../users/repositories/users.repository';
import { EmailManager } from '../../email/emailManager';
import { v4 as uuidv4 } from 'uuid';
import { resendConfirmation } from '../../base/types/users.model';

@Injectable()
export class ResendConfirmationUseCase {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersRepository: UsersRepository,
    private emailManager: EmailManager,
  ) {}

  async resendConfirmation(email: resendConfirmation) {
    const user = await this.usersQueryRepository.findByLoginOrEmail(email.email);
    if (!user) throw new BadRequestException([{ message: "User doesn't exists", field: 'email' }]);
    if (user.isConfirmed)
      throw new BadRequestException([{ message: 'User already confirmed', field: 'email' }]);

    const confirmationCode = uuidv4();
    await this.usersRepository.changeConfirmationCode(user.id, confirmationCode);
    await this.emailManager.resendConfirmationCode(user, confirmationCode);
    return;
  }
}
