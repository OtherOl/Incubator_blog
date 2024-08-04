import { Injectable } from '@nestjs/common';
import { GetDeviceIdUseCase } from './getDeviceId.use-case';
import { AuthBlackListRepository } from '../repositories/auth-black-list-repository.service';
import { AuthWhiteListRepository } from '../repositories/auth-white_list.repository';
import { SecurityRepository } from '../../security-devices/repositories/security.repository';

@Injectable()
export class LogoutUseCase {
  constructor(
    private getDeviceIdUseCase: GetDeviceIdUseCase,
    private authBlackListRepository: AuthBlackListRepository,
    private authWhiteListRepository: AuthWhiteListRepository,
    private securityRepository: SecurityRepository,
  ) {}

  async logout(refreshToken: string) {
    const deviceId = await this.getDeviceIdUseCase.getDeviceId(refreshToken);
    await this.authBlackListRepository.blackList(refreshToken);
    await this.authWhiteListRepository.deleteToken(refreshToken);
    await this.securityRepository.deleteSpecifiedSession(deviceId);
    return;
  }
}
