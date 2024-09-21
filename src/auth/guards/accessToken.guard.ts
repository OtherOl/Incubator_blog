import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersQueryRepo: UsersQueryRepository,
  ) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    if (!req.headers.authorization) throw new UnauthorizedException();
    const token = req.headers.authorization.split(' ')[1];
    try {
      const verifiedToken = await this.jwtService.verify(token);
      const user = await this.usersQueryRepo.getFullUserInfoById(verifiedToken.userId);
      if (user?.banInfo.isBanned === true) {
        throw new UnauthorizedException();
      } else {
        return true;
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
