import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from '../../../auth/application/auth.service';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';

@Injectable()
export class GetUnfinishedGameUseCase {
  constructor(
    private authService: AuthService,
    private pairQuizGameQueryRepository: PairQuizGameQueryRepository,
  ) {}

  async getGame(accessToken: string) {
    const userId = await this.authService.getUserIdByToken(accessToken.split(' ')[1]);
    const game = await this.pairQuizGameQueryRepository.getUnfinishedGame(userId);
    if (!game) throw new NotFoundException('No active pair');
    return game;
  }
}
