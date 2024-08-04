import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthService } from '../../../auth/application/auth.service';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';
import { UsersQueryRepository } from '../../../users/repositories/users.query-repository';
import { JoinOrCreateGameForMainUseCase } from './joinOrCreateGameForMain.use-case';

@Injectable()
export class CreateOrConnectGameUseCase {
  constructor(
    private authService: AuthService,
    private pairQuizGameQueryRepository: PairQuizGameQueryRepository,
    private usersQueryRepository: UsersQueryRepository,
    private joinOrCreateGameForMainUseCase: JoinOrCreateGameForMainUseCase,
  ) {}

  async createOrConnect(accessToken: string) {
    const userId = await this.authService.getUserIdByToken(accessToken.split(' ')[1]);
    const user = await this.usersQueryRepository.getUserById(userId);
    const game = await this.pairQuizGameQueryRepository.getUnfinishedGame(userId);
    if (game) {
      throw new ForbiddenException('user is already participating in active pair');
    } else if (!game) {
      return await this.joinOrCreateGameForMainUseCase.joinOrCreateGame(userId, user!);
    }
  }
}
