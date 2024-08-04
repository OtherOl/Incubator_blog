import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthWhiteListRepository } from '../repositories/auth-white_list.repository';

@Injectable()
export class CreateNewRefreshTokenUseCase {
  constructor(
    private jwtService: JwtService,
    private authWhiteListRepository: AuthWhiteListRepository,
  ) {}

  async createNewRefreshToken(userId: string, deviceId: string) {
    const refreshToken = this.jwtService.sign({ userId: userId, deviceId: deviceId }, { expiresIn: '20s' });
    await this.authWhiteListRepository.createNewToken(refreshToken, userId, deviceId);
    return refreshToken;
  }
}
