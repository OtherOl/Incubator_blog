import { Controller, Delete, Get, HttpCode, Param, Req, UseGuards } from '@nestjs/common';
import { SecurityQueryRepository } from '../repositories/security.query-repository';
import { SecurityRepository } from '../repositories/security.repository';
import { Request } from 'express';
import { AuthService } from '../../auth/application/auth.service';
import { SkipThrottle } from '@nestjs/throttler';
import { RefreshTokenGuard } from '../../auth/guards/refreshToken.guard';
import { GetDeviceIdUseCase } from '../../auth/use-cases/getDeviceId.use-case';
import { DeleteTokensExceptOneUseCase } from '../use-cases/deleteTokensExceptOne.use-case';
import { DeleteSessionByIdUseCase } from '../use-cases/deleteSessionById.use-case';

@Controller('security/devices')
export class SecurityController {
  constructor(
    private securityQueryRepository: SecurityQueryRepository,
    private securityRepository: SecurityRepository,
    private authService: AuthService,
    private getDeviceIdUseCase: GetDeviceIdUseCase,
    private deleteTokensExceptOneUseCase: DeleteTokensExceptOneUseCase,
    private deleteSessionByIdUseCase: DeleteSessionByIdUseCase,
  ) {}

  @SkipThrottle()
  @UseGuards(RefreshTokenGuard)
  @Get()
  @HttpCode(200)
  async getAllSessions(@Req() request: Request) {
    const refreshToken = request.cookies.refreshToken;
    const userId = await this.authService.getUserIdByToken(refreshToken);
    return await this.securityQueryRepository.getAllSessions(userId);
  }

  @SkipThrottle()
  @UseGuards(RefreshTokenGuard)
  @Delete()
  @HttpCode(204)
  async deleteAllExceptOne(@Req() request: Request) {
    const refreshToken = request.cookies.refreshToken;
    const deviceId = await this.getDeviceIdUseCase.getDeviceId(refreshToken);
    await this.securityRepository.deleteAllSessions(deviceId);
    await this.deleteTokensExceptOneUseCase.deleteAllTokens(refreshToken);
    return;
  }

  @SkipThrottle()
  @UseGuards(RefreshTokenGuard)
  @Delete(':deviceId')
  @HttpCode(204)
  async deleteSessionById(@Req() request: Request, @Param('deviceId') deviceId: string) {
    await this.deleteSessionByIdUseCase.deleteSession(request.cookies.refreshToken, deviceId);
    return;
  }
}
