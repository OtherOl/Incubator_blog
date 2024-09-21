import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async createPasswordHash(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async createAccessToken(userId: string) {
    return this.jwtService.sign({ userId: userId }, { expiresIn: '20m' });
  }

  async verifyToken(token: string) {
    if (!token) throw new UnauthorizedException();
    return this.jwtService.verify(token);
  }

  async getUserIdByToken(token: string | undefined): Promise<string> {
    if (!token) throw new UnauthorizedException();
    try {
      const user = await this.jwtService.verify(token);
      return user.userId;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async getUserIdForGet(token: string | undefined): Promise<string> {
    if (!token) return 'fffff3ea02afffffc87fffff';
    try {
      const user = await this.jwtService.verify(token);
      return user.userId;
    } catch (error) {
      return 'fffff3ea02afffffc87fffff';
    }
  }
}
