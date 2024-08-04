import { Injectable } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { AuthBlackListRepository } from '../repositories/auth-black-list-repository.service';
import { AuthWhiteListRepository } from '../repositories/auth-white_list.repository';
import { CreateNewRefreshTokenUseCase } from './createNewRefreshToken.use-case';
import { SecurityRepository } from '../../security-devices/repositories/security.repository';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private authService: AuthService,
    private authBlackListRepository: AuthBlackListRepository,
    private authWhiteListRepository: AuthWhiteListRepository,
    private createNewRefreshTokenUseCase: CreateNewRefreshTokenUseCase,
    private securityRepository: SecurityRepository,
  ) {}

  async refreshToken(refreshToken: string) {
    const verify = await this.authService.verifyToken(refreshToken);
    const userId = await this.authService.getUserIdByToken(refreshToken);
    await this.authWhiteListRepository.deleteToken(refreshToken);
    await this.authBlackListRepository.blackList(refreshToken);

    const accessToken = await this.authService.createAccessToken(userId);
    const newRefreshToken = await this.createNewRefreshTokenUseCase.createNewRefreshToken(
      userId,
      verify.deviceId,
    );

    await this.securityRepository.updateSession(verify.deviceId);
    return {
      accessToken,
      newRefreshToken,
    };
  }
}
