import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from '../../../auth/application/auth.service';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';
import { PairQuizGameRepository } from '../repositories/pairQuizGame.repository';
import { ChangeStatusToFinishedUseCase } from './changeStatusToFinished.use-case';
import { AnswerStatus, GameStatus } from '../../../common/types/game.model';

@Injectable()
export class GetUnfinishedGameUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly pairQuizGameQueryRepository: PairQuizGameQueryRepository,
    private readonly pairQuizGameRepo: PairQuizGameRepository,
    private readonly changeStatusToFinishedUseCase: ChangeStatusToFinishedUseCase,
  ) {}

  async getGame(accessToken: string) {
    const userId = await this.authService.getUserIdByToken(accessToken.split(' ')[1]);
    const game = await this.pairQuizGameQueryRepository.getUnfinishedGame(userId);
    if (!game) throw new NotFoundException('No active pair');

    const firstPlayer = await this.pairQuizGameQueryRepository.getFirstPlayerByGameId(game.id);
    const secondPlayer = await this.pairQuizGameQueryRepository.getSecondPlayerByGameId(game.id);

    if (
      firstPlayer?.timeToAnswer &&
      firstPlayer.timeToAnswer < new Date().toISOString() &&
      game.status === GameStatus.Active
    ) {
      let answersLength: number;
      await this.pairQuizGameRepo.changeGameStatusToFinished(game.id);
      answersLength = firstPlayer.answers.length;
      while (answersLength < game.questions!.length) {
        await this.pairQuizGameRepo.sendAnswerPlayer(
          firstPlayer.id,
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
      await this.pairQuizGameRepo.setFinishAnswerDateFirstPlayer(game.id);
      await this.changeStatusToFinishedUseCase.changeToFinished(game.id, game.questions);
    } else if (
      secondPlayer?.timeToAnswer &&
      secondPlayer.timeToAnswer < new Date().toISOString() &&
      game.status === GameStatus.Active
    ) {
      let answersLength: number;
      await this.pairQuizGameRepo.changeGameStatusToFinished(game.id);
      answersLength = secondPlayer.answers.length;
      while (answersLength < game.questions!.length) {
        await this.pairQuizGameRepo.sendAnswerPlayer(
          secondPlayer.id,
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
      await this.pairQuizGameRepo.setFinishAnswerDateSecondPlayer(game.id);
      await this.changeStatusToFinishedUseCase.changeToFinished(game.id, game.questions);
    }

    const updatedGame = await this.pairQuizGameQueryRepository.getUnfinishedGame(userId);
    if (!updatedGame) {
      throw new NotFoundException('No active pair');
    } else {
      return updatedGame;
    }
  }
}
