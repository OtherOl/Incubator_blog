import { AuthService } from '../application/auth.service';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetProfileUseCase {
  constructor(
    private authService: AuthService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async profile(accessToken: string) {
    const userId = await this.authService.getUserIdByToken(accessToken.split(' ')[1]);
    return await this.usersQueryRepository.getUserById(userId);
  }
}
