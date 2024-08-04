import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthService } from '../../../auth/application/auth.service';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';
import { FirstPlayerSendAnswerUseCase } from './firstPlayerSendAnswer.use-case';
import { SecondPlayerSendAnswerUseCase } from './secondPlayerSendAnswer.use-case';
import { PlayerType } from '../../../base/types/game.model';

@Injectable()
export class SendAnswersUseCase {
  constructor(
    private authService: AuthService,
    private pairQuizGameQueryRepository: PairQuizGameQueryRepository,
    private firstPlayerSendAnswerUseCase: FirstPlayerSendAnswerUseCase,
    private secondPlayerSendAnswerUseCase: SecondPlayerSendAnswerUseCase,
  ) {}

  async sendAnswers(inputAnswer: string, accessToken: string) {
    const userId = await this.authService.getUserIdByToken(accessToken.split(' ')[1]);
    const game = await this.pairQuizGameQueryRepository.getUnfinishedGame(userId);
    if (!game || game.status !== 'Active') throw new ForbiddenException('No active pair');
    const player = await this.pairQuizGameQueryRepository.getPlayerByGameIdUserId(game.id, userId);

    if (player?.playerType === PlayerType.FirstPlayer)
      return await this.firstPlayerSendAnswerUseCase.sendAnswer(
        player,
        game.id,
        game.questions!,
        inputAnswer,
      );
    if (player?.playerType === PlayerType.SecondPlayer)
      return await this.secondPlayerSendAnswerUseCase.sendAnswer(
        player,
        game.id,
        game.questions!,
        inputAnswer,
      );
  }
}
