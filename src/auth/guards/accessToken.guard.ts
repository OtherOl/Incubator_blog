import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    if (!req.headers.authorization) throw new UnauthorizedException();
    const token = req.headers.authorization.split(' ')[1];
    try {
      await this.jwtService.verify(token);
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
