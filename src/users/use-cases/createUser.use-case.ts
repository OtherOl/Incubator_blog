import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/application/auth.service';
import { UsersRepository } from '../repositories/users.repository';
import { createUserModel, userModel } from '../../base/types/users.model';
import { User } from '../domain/users.entity';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private authService: AuthService,
    private usersRepository: UsersRepository,
  ) {}

  async createUser(inputData: createUserModel) {
    const passwordHash = await this.authService.createPasswordHash(inputData.password);

    const newUser: userModel = User.createNewUser(inputData.login, inputData.email, passwordHash, true);
    return await this.usersRepository.createUser(newUser);
  }
}
