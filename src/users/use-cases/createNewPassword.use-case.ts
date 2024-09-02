import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { UsersQueryRepository } from '../repositories/users.query-repository';
import { AuthService } from '../../auth/application/auth.service';
import { createNewPassword } from '../../common/types/users.model';

@Injectable()
export class CreateNewPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private usersQueryRepository: UsersQueryRepository,
    private authService: AuthService,
  ) {}

  async createNewPassword(inputData: createNewPassword) {
    const user = await this.usersQueryRepository.findUserByRecoveryCode(inputData.recoveryCode);
    if (!user) throw new BadRequestException([{ message: 'User not found', field: 'login' }]);
    if (user.recoveryConfirmation.recoveryCode !== inputData.recoveryCode)
      throw new BadRequestException([{ message: 'RecoveryCode is false', field: 'recoveryCode' }]);
    if (user.recoveryConfirmation.expirationDate < new Date().toISOString())
      throw new BadRequestException([{ message: 'Date has expired', field: 'expirationDate' }]);

    const newPassword = await this.authService.createPasswordHash(inputData.newPassword);
    await this.usersRepository.updatePassword(user.id, newPassword);
    return;
  }
}
