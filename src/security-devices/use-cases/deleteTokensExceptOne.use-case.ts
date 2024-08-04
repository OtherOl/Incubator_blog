import { Injectable } from '@nestjs/common';
import { AuthWhiteListRepository } from '../../auth/repositories/auth-white_list.repository';
import { AuthBlackListRepository } from '../../auth/repositories/auth-black-list-repository.service';
import { DecodeRefreshTokenUseCase } from '../../auth/use-cases/decodeRefreshToken.use-case';

@Injectable()
export class DeleteTokensExceptOneUseCase {
  constructor(
    private decodeRefreshTokenUseCase: DecodeRefreshTokenUseCase,
    private authWhileListRepository: AuthWhiteListRepository,
    private authBlackListRepository: AuthBlackListRepository,
  ) {}

  async deleteAllTokens(refreshToken: string) {
    const decodedToken = await this.decodeRefreshTokenUseCase.decodeRefreshToken(refreshToken);
    const tokens = await this.authWhileListRepository.findTokens(decodedToken.userId, decodedToken.deviceId);
    if (!tokens) return;
    for (let i = 0; i < tokens.length; i++) {
      await this.authBlackListRepository.blackList(tokens[i].token);
    }
    await this.authWhileListRepository.deleteAllExceptOne(decodedToken.userId, decodedToken.deviceId);
    return;
  }
}
