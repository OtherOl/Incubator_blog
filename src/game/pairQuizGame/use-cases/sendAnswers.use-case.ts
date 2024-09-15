import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthService } from '../../../auth/application/auth.service';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';
import { FirstPlayerSendAnswerUseCase } from './firstPlayerSendAnswer.use-case';
import { SecondPlayerSendAnswerUseCase } from './secondPlayerSendAnswer.use-case';
import { AnswerStatus, PlayerType } from '../../../common/types/game.model';
import { PairQuizGameRepository } from '../repositories/pairQuizGame.repository';
import { ChangeStatusToFinishedUseCase } from './changeStatusToFinished.use-case';

@Injectable()
export class SendAnswersUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly pairQuizGameQueryRepository: PairQuizGameQueryRepository,
    private readonly pairQuizGameRepo: PairQuizGameRepository,
    private readonly firstPlayerSendAnswerUseCase: FirstPlayerSendAnswerUseCase,
    private readonly secondPlayerSendAnswerUseCase: SecondPlayerSendAnswerUseCase,
    private readonly changeStatusToFinishedUseCase: ChangeStatusToFinishedUseCase,
  ) {}

  async sendAnswers(inputAnswer: string, accessToken: string) {
    const userId = await this.authService.getUserIdByToken(accessToken.split(' ')[1]);
    const game = await this.pairQuizGameQueryRepository.getUnfinishedGame(userId);
    if (!game || game.status !== 'Active') throw new ForbiddenException('No active pair');
    const player = await this.pairQuizGameQueryRepository.getPlayerByGameIdUserId(game.id, userId);

    if (player?.timeToAnswer && player.timeToAnswer < new Date().toISOString()) {
      let answersLength: number;
      await this.pairQuizGameRepo.changeGameStatusToFinished(game.id);
      answersLength = player.answers.length;
      while (answersLength < game.questions.length) {
        await this.pairQuizGameRepo.sendAnswerPlayer(
          player!.id,
          game.id,
          {
            addedAt: new Date().toISOString(),
            answerStatus: AnswerStatus.Incorrect,
            questionId: game.questions[answersLength].id,
          },
          '- 0',
        );
        answersLength++;
      }
      if (player.playerType === PlayerType.FirstPlayer) {
        await this.pairQuizGameRepo.setFinishAnswerDateFirstPlayer(game.id);
      } else if (player.playerType === PlayerType.SecondPlayer) {
        await this.pairQuizGameRepo.setFinishAnswerDateSecondPlayer(game.id);
      }
      await this.changeStatusToFinishedUseCase.changeToFinished(game.id, game.questions);
      throw new ForbiddenException('You already answered all questions');
    }
    if (player?.playerType === PlayerType.FirstPlayer) {
      return await this.firstPlayerSendAnswerUseCase.sendAnswer(
        player,
        game.id,
        game.questions!,
        inputAnswer,
        game.secondPlayerProgress!.player.id,
      );
    }
    if (player?.playerType === PlayerType.SecondPlayer) {
      return await this.secondPlayerSendAnswerUseCase.sendAnswer(
        player,
        game.id,
        game.questions!,
        inputAnswer,
        game.firstPlayerProgress!.player.id,
      );
    }
  }
}
