import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { CreateNewPasswordUseCase } from './use-cases/createNewPassword.use-case';
import { CreateUserUseCase } from './use-cases/createUser.use-case';
import { CreateUserForRegistrationUseCase } from './use-cases/createUserForRegistration.use-case';
import { DeleteUserUseCase } from './use-cases/deleteUser.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/users.entity';
import { AuthService } from '../auth/application/auth.service';
import { UsersRepository } from './repositories/users.repository';
import { UsersQueryRepository } from './repositories/users.query-repository';
import { EmailManager } from '../email/emailManager';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    CreateNewPasswordUseCase,
    CreateUserUseCase,
    CreateUserForRegistrationUseCase,
    DeleteUserUseCase,
    AuthService,
    UsersRepository,
    UsersQueryRepository,
    EmailManager,
  ],
})
export class UsersModule {}
