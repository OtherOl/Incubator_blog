import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GetDeviceIdUseCase {
  constructor(private jwtService: JwtService) {}

  async getDeviceId(token: string | undefined) {
    if (!token) throw new UnauthorizedException();
    try {
      const user = await this.jwtService.verify(token);
      return user.deviceId;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
