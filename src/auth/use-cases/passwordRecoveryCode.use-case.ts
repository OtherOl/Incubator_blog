import { HttpCode, Injectable } from '@nestjs/common';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';
import { EmailManager } from '../../email/emailManager';
import { resendConfirmation } from '../../base/types/users.model';

@Injectable()
export class PasswordRecoveryCodeUseCase {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private emailManager: EmailManager,
  ) {}

  async passwordRecoveryCode(email: resendConfirmation) {
    const user = await this.usersQueryRepository.findByLoginOrEmail(email.email);
    if (!user) return HttpCode(204);
    await this.emailManager.sendRecoveryCode(user);
    return;
  }
}
