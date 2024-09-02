import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
  ConfirmationCode,
  createNewPassword,
  createUserModel,
  resendConfirmation,
  UserLogin,
} from '../../common/types/users.model';
import { AuthService } from '../application/auth.service';
import { CreateUserForRegistrationUseCase } from '../../users/use-cases/createUserForRegistration.use-case';
import { CreateNewPasswordUseCase } from '../../users/use-cases/createNewPassword.use-case';
import { CheckCredentialsUseCase } from '../use-cases/checkCredentials.use-case';
import { ConfirmEmailUseCase } from '../use-cases/confirmEmail.use-case';
import { ResendConfirmationUseCase } from '../use-cases/resendConfirmation.use-case';
import { PasswordRecoveryCodeUseCase } from '../use-cases/passwordRecoveryCode.use-case';
import { SkipThrottle } from '@nestjs/throttler';
import { AccessTokenGuard } from '../guards/accessToken.guard';
import { RefreshTokenGuard } from '../guards/refreshToken.guard';
import { CreateRefreshTokenUseCase } from '../use-cases/createRefreshToken.use-case';
import { GetProfileUseCase } from '../use-cases/getProfile-use.case';
import { LogoutUseCase } from '../use-cases/logout.use-case';
import { RefreshTokenUseCase } from '../use-cases/refreshToken.use-case';
import { CreateSessionUseCase } from '../../security-devices/use-cases/createSession.use-case';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private createUserForRegistrationUseCase: CreateUserForRegistrationUseCase,
    private createNewPasswordUseCase: CreateNewPasswordUseCase,
    private checkCredentialsUseCase: CheckCredentialsUseCase,
    private confirmEmailUseCase: ConfirmEmailUseCase,
    private resendConfirmationUseCase: ResendConfirmationUseCase,
    private passwordRecoveryCodeUseCase: PasswordRecoveryCodeUseCase,
    private createRefreshTokenUseCase: CreateRefreshTokenUseCase,
    private createSessionUseCase: CreateSessionUseCase,
    private getProfileUseCase: GetProfileUseCase,
    private logoutUseCase: LogoutUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @HttpCode(204)
  @Post('password-recovery')
  async passwordRecovery(@Body() email: resendConfirmation) {
    return await this.passwordRecoveryCodeUseCase.passwordRecoveryCode(email);
  }

  @HttpCode(204)
  @Post('new-password')
  async newPassword(@Body() inputData: createNewPassword) {
    return await this.createNewPasswordUseCase.createNewPassword(inputData);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() inputData: UserLogin, @Res() response: Response, @Req() req: Request) {
    const user = await this.checkCredentialsUseCase.checkCredentials(inputData);
    const token = await this.authService.createAccessToken(user.id);
    const refreshToken = await this.createRefreshTokenUseCase.createRefreshToken(user.id);
    await this.createSessionUseCase.createSession(req.ip!, req.headers['user-agent'], refreshToken);
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return response.send({ accessToken: token });
  }

  @SkipThrottle()
  @HttpCode(200)
  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(@Req() request: Request, @Res() response: Response) {
    const token = await this.refreshTokenUseCase.refreshToken(request.cookies.refreshToken);
    response.cookie('refreshToken', token.newRefreshToken, {
      httpOnly: true,
      secure: true,
    });
    return response.send({ accessToken: token.accessToken });
  }

  @HttpCode(204)
  @Post('registration-confirmation')
  async registrationConfirmation(@Body() code: ConfirmationCode) {
    return await this.confirmEmailUseCase.confirmEmail(code);
  }

  @HttpCode(204)
  @Post('registration')
  async registration(@Body() inputData: createUserModel) {
    await this.createUserForRegistrationUseCase.createUserForRegistration(inputData);
    return;
  }

  @HttpCode(204)
  @Post('registration-email-resending')
  async registrationEmailResending(@Body() email: resendConfirmation) {
    return await this.resendConfirmationUseCase.resendConfirmation(email);
  }

  @HttpCode(204)
  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    await this.logoutUseCase.logout(request.cookies.refreshToken);
    return response.clearCookie('refreshToken').sendStatus(204);
  }

  @SkipThrottle()
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  @Get('me')
  async getProfile(@Req() request: Request) {
    const user = await this.getProfileUseCase.profile(request.headers.authorization!);
    return {
      email: user!.email,
      login: user!.login,
      userId: user!.id,
    };
  }
}
