import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthWhiteListRepository } from '../../auth/repositories/auth-white_list.repository';
import { AuthService } from '../../auth/application/auth.service';
import { SecurityQueryRepository } from '../repositories/security.query-repository';
import { SecurityRepository } from '../repositories/security.repository';

@Injectable()
export class DeleteSessionByIdUseCase {
  constructor(
    private authWhiteListRepository: AuthWhiteListRepository,
    private authService: AuthService,
    private securityQueryRepository: SecurityQueryRepository,
    private securityRepository: SecurityRepository,
  ) {}

  async deleteSession(refreshToken: string, deviceId: string) {
    const inputUserId = await this.authService.getUserIdByToken(refreshToken);
    const session = await this.securityQueryRepository.getSessionById(deviceId);
    if (inputUserId !== session.userId) throw new ForbiddenException();
    await this.securityRepository.deleteSpecifiedSession(deviceId);
    await this.authWhiteListRepository.deleteTokenByDeviceId(deviceId);
  }
}
