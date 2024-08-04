import { Module } from '@nestjs/common';
import { SecurityController } from './controller/security.controller';
import { SecurityRepository } from './repositories/security.repository';
import { SecurityQueryRepository } from './repositories/security.query-repository';
import { CreateSessionUseCase } from './use-cases/createSession.use-case';
import { DeleteSessionByIdUseCase } from './use-cases/deleteSessionById.use-case';
import { DeleteTokensExceptOneUseCase } from './use-cases/deleteTokensExceptOne.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Security } from './domain/security.entity';
import { AuthService } from '../auth/application/auth.service';
import { AuthWhiteListRepository } from '../auth/repositories/auth-white_list.repository';
import { DecodeRefreshTokenUseCase } from '../auth/use-cases/decodeRefreshToken.use-case';
import { AuthBlackListRepository } from '../auth/repositories/auth-black-list-repository.service';
import { AuthWhiteList } from '../auth/domain/auth-white_list.entity';
import { AuthBlackList } from '../auth/domain/auth-black_list.entity';
import { GetDeviceIdUseCase } from '../auth/use-cases/getDeviceId.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Security, AuthWhiteList, AuthBlackList])],
  controllers: [SecurityController],
  providers: [
    SecurityRepository,
    SecurityQueryRepository,
    CreateSessionUseCase,
    DeleteSessionByIdUseCase,
    DeleteTokensExceptOneUseCase,
    AuthService,
    AuthWhiteListRepository,
    AuthBlackListRepository,
    DecodeRefreshTokenUseCase,
    GetDeviceIdUseCase,
  ],
})
export class SecurityDevicesModule {}
