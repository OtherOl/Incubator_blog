import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthService } from '../../../auth/application/auth.service';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';
import { FirstPlayerSendAnswerUseCase } from './firstPlayerSendAnswer.use-case';
import { SecondPlayerSendAnswerUseCase } from './secondPlayerSendAnswer.use-case';
import { AnswerStatus, PlayerType } from '../../../common/types/game.model';
import { PairQuizGameRepository } from '../repositories/pairQuizGame.repository';

@Injectable()
export class SendAnswersUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly pairQuizGameQueryRepository: PairQuizGameQueryRepository,
    private readonly pairQuizGameRepo: PairQuizGameRepository,
    private readonly firstPlayerSendAnswerUseCase: FirstPlayerSendAnswerUseCase,
    private readonly secondPlayerSendAnswerUseCase: SecondPlayerSendAnswerUseCase,
  ) {}

  async sendAnswers(inputAnswer: string, accessToken: string) {
    const userId = await this.authService.getUserIdByToken(accessToken.split(' ')[1]);
    const game = await this.pairQuizGameQueryRepository.getUnfinishedGame(userId);
    if (!game || game.status !== 'Active') throw new ForbiddenException('No active pair');
    const player = await this.pairQuizGameQueryRepository.getPlayerByGameIdUserId(game.id, userId);

    if (player?.timeToAnswer < new Date().toISOString()) {
      await this.pairQuizGameRepo.changeGameStatusToFinished(game.id);
      const questionNumber: number = player.answers.length;
      while (questionNumber < game.questions.length) {
        await this.pairQuizGameRepo.sendAnswerPlayer(
          player!.id,
          game.id,
          {
            addedAt: new Date().toISOString(),
            answerStatus: AnswerStatus.Incorrect,
            questionId: game.questions[questionNumber].id,
          },
          '- 0',
        );
      }
    }
    if (player?.playerType === PlayerType.FirstPlayer)
      return await this.firstPlayerSendAnswerUseCase.sendAnswer(
        player,
        game.id,
        game.questions!,
        inputAnswer,
        game.secondPlayerProgress!.id,
      );
    if (player?.playerType === PlayerType.SecondPlayer)
      return await this.secondPlayerSendAnswerUseCase.sendAnswer(
        player,
        game.id,
        game.questions!,
        inputAnswer,
        game.firstPlayerProgress!.id,
      );
  }
}
