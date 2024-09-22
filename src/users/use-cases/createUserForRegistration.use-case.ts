import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersQueryRepository } from '../repositories/users.query-repository';
import { AuthService } from '../../auth/application/auth.service';
import { EmailManager } from '../../email/emailManager';
import { UsersRepository } from '../repositories/users.repository';
import { createUserModel, userModel } from '../../common/types/users.model';
import { User } from '../entities/users.entity';

@Injectable()
export class CreateUserForRegistrationUseCase {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private authService: AuthService,
    private emailManager: EmailManager,
    private usersRepository: UsersRepository,
  ) {}

  async createUserForRegistration(inputData: createUserModel) {
    const isExists = await this.usersQueryRepository.findByLoginOrEmail(inputData.email);
    const isExistsLogin = await this.usersQueryRepository.findByLoginOrEmail(inputData.login);
    if (isExists)
      throw new BadRequestException([{ message: 'User with current email already exists', field: 'email' }]);
    if (isExistsLogin)
      throw new BadRequestException([{ message: 'User with current login already exists', field: 'login' }]);

    const passwordHash = await this.authService.createPasswordHash(inputData.password);

    const newUser: userModel = User.createNewUser(inputData.login, inputData.email, passwordHash, false);

    await this.emailManager.sendEmailConfirmationCode(newUser);
    await this.usersRepository.createUser(newUser);
    return;
  }
}
