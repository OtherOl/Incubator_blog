import { Injectable } from '@nestjs/common';
import { AuthService } from '../../../auth/application/auth.service';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';

@Injectable()
export class GetStatisticUseCase {
  constructor(
    private authService: AuthService,
    private pairQuizGameQueryRepository: PairQuizGameQueryRepository,
  ) {}

  async getStatistic(accessToken: string) {
    const userId = await this.authService.getUserIdByToken(accessToken.split(' ')[1]);
    return await this.pairQuizGameQueryRepository.getMyStatistic(userId);
  }
}
