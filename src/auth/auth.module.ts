import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { CheckCredentialsUseCase } from './use-cases/checkCredentials.use-case';
import { ConfirmEmailUseCase } from './use-cases/confirmEmail.use-case';
import { CreateNewRefreshTokenUseCase } from './use-cases/createNewRefreshToken.use-case';
import { CreateRefreshTokenUseCase } from './use-cases/createRefreshToken.use-case';
import { DecodeRefreshTokenUseCase } from './use-cases/decodeRefreshToken.use-case';
import { GetDeviceIdUseCase } from './use-cases/getDeviceId.use-case';
import { GetProfileUseCase } from './use-cases/getProfile-use.case';
import { LogoutUseCase } from './use-cases/logout.use-case';
import { PasswordRecoveryCodeUseCase } from './use-cases/passwordRecoveryCode.use-case';
import { RefreshTokenUseCase } from './use-cases/refreshToken.use-case';
import { ResendConfirmationUseCase } from './use-cases/resendConfirmation.use-case';
import { AuthBlackList } from './entities/auth-black_list.entity';
import { AuthWhiteList } from './entities/auth-white_list.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/users.entity';
import { UsersQueryRepository } from '../users/repositories/users.query-repository';
import { UsersRepository } from '../users/repositories/users.repository';
import { AuthService } from './application/auth.service';
import { EmailManager } from '../email/emailManager';
import { AuthWhiteListRepository } from './repositories/auth-white_list.repository';
import { AuthBlackListRepository } from './repositories/auth-black-list-repository.service';
import { SecurityRepository } from '../security-devices/repositories/security.repository';
import { Security } from '../security-devices/entities/security.entity';
import { CreateUserForRegistrationUseCase } from '../users/use-cases/createUserForRegistration.use-case';
import { CreateNewPasswordUseCase } from '../users/use-cases/createNewPassword.use-case';
import { CreateSessionUseCase } from '../security-devices/use-cases/createSession.use-case';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { BasicAuthGuard } from './guards/basic-auth.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { BasicStrategy } from './strategies/basic.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([AuthBlackList, AuthWhiteList, User, Security])],
  controllers: [AuthController],
  providers: [
    AuthService,
    CheckCredentialsUseCase,
    ConfirmEmailUseCase,
    CreateNewRefreshTokenUseCase,
    CreateRefreshTokenUseCase,
    DecodeRefreshTokenUseCase,
    GetDeviceIdUseCase,
    GetProfileUseCase,
    LogoutUseCase,
    PasswordRecoveryCodeUseCase,
    RefreshTokenUseCase,
    ResendConfirmationUseCase,
    UsersQueryRepository,
    UsersRepository,
    EmailManager,
    AuthWhiteListRepository,
    AuthBlackListRepository,
    SecurityRepository,
    CreateUserForRegistrationUseCase,
    CreateNewPasswordUseCase,
    CreateSessionUseCase,
    AccessTokenGuard,
    BasicAuthGuard,
    BasicStrategy,
    RefreshTokenGuard,
  ],
})
export class AuthModule {}
