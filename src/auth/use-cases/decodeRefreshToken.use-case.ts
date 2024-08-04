import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DecodeRefreshTokenUseCase {
  constructor(private jwtService: JwtService) {}

  async decodeRefreshToken(token: string | undefined) {
    if (!token) throw new UnauthorizedException();
    return await this.jwtService.decode(token);
  }
}
