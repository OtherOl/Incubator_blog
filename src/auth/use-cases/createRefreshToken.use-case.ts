import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthWhiteListRepository } from '../repositories/auth-white_list.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateRefreshTokenUseCase {
  constructor(
    private jwtService: JwtService,
    private authWhiteListRepository: AuthWhiteListRepository,
  ) {}

  async createRefreshToken(userId: string) {
    const deviceId = uuidv4();
    const refreshToken = this.jwtService.sign({ userId, deviceId }, { expiresIn: '20s' });
    await this.authWhiteListRepository.createNewToken(refreshToken, userId, deviceId);
    return refreshToken;
  }
}
