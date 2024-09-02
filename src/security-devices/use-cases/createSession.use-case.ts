import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/application/auth.service';
import { SecurityRepository } from '../repositories/security.repository';
import { securityViewModel } from '../../common/types/security.model';
import { Security } from '../domain/security.entity';

@Injectable()
export class CreateSessionUseCase {
  constructor(
    private authService: AuthService,
    private securityRepository: SecurityRepository,
  ) {}

  async createSession(ip: string, title: string = 'Chrome 105', refreshToken: string) {
    const verifiedToken = await this.authService.verifyToken(refreshToken);
    const newSession: securityViewModel = Security.createSession(ip, title, verifiedToken);
    await this.securityRepository.createSession(newSession);
    return;
  }
}
