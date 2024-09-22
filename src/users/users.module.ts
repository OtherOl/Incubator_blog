import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { CreateNewPasswordUseCase } from './use-cases/createNewPassword.use-case';
import { CreateUserUseCase } from './use-cases/createUser.use-case';
import { CreateUserForRegistrationUseCase } from './use-cases/createUserForRegistration.use-case';
import { DeleteUserUseCase } from './use-cases/deleteUser.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { AuthService } from '../auth/application/auth.service';
import { UsersRepository } from './repositories/users.repository';
import { UsersQueryRepository } from './repositories/users.query-repository';
import { EmailManager } from '../email/emailManager';
import { BanUserUseCase } from './use-cases/banUser.use-case';
import { AuthWhiteListRepository } from '../auth/repositories/auth-white_list.repository';
import { AuthWhiteList } from '../auth/entities/auth-white_list.entity';
import { AuthBlackListRepository } from '../auth/repositories/auth-black-list-repository.service';
import { AuthBlackList } from '../auth/entities/auth-black_list.entity';
import { SecurityRepository } from '../security-devices/repositories/security.repository';
import { Security } from '../security-devices/entities/security.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, AuthWhiteList, AuthBlackList, Security])],
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
    BanUserUseCase,
    AuthWhiteListRepository,
    AuthBlackListRepository,
    SecurityRepository,
  ],
})
export class UsersModule {}
