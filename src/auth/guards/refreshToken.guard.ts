import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthBlackListRepository } from '../repositories/auth-black-list-repository.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authRepository: AuthBlackListRepository,
  ) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    if (!req.cookies.refreshToken) throw new UnauthorizedException();

    const token = req.cookies.refreshToken;
    const isInvalid = await this.authRepository.findInvalidToken(token);
    if (isInvalid) throw new UnauthorizedException();

    try {
      await this.jwtService.verify(token);
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
