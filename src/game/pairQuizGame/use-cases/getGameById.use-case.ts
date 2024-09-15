import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from '../../../auth/application/auth.service';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';
import { AnswerStatus, GameStatus } from '../../../common/types/game.model';
import { PairQuizGameRepository } from '../repositories/pairQuizGame.repository';
import { ChangeStatusToFinishedUseCase } from './changeStatusToFinished.use-case';

@Injectable()
export class GetGameByIdUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly pairQuizGameQueryRepository: PairQuizGameQueryRepository,
    private readonly pairQuizGameRepo: PairQuizGameRepository,
    private readonly changeStatusToFinishedUseCase: ChangeStatusToFinishedUseCase,
  ) {}

  async getGame(accessToken: string, gameId: string) {
    const userId = await this.authService.getUserIdByToken(accessToken.split(' ')[1]);
    const game = await this.pairQuizGameQueryRepository.getGameById(gameId);
    if (!game) throw new NotFoundException('Game not found');
    const player = await this.pairQuizGameQueryRepository.getPlayerByGameIdUserId(gameId, userId);
    const firstPlayer = await this.pairQuizGameQueryRepository.getFirstPlayerByGameId(gameId);
    const secondPlayer = await this.pairQuizGameQueryRepository.getSecondPlayerByGameId(gameId);

    if (
      firstPlayer?.timeToAnswer &&
      firstPlayer.timeToAnswer < new Date().toISOString() &&
      game.status === GameStatus.Active
    ) {
      let answersLength: number;
      await this.pairQuizGameRepo.changeGameStatusToFinished(gameId);
      answersLength = firstPlayer.answers.length;
      while (answersLength < game.questions!.length) {
        await this.pairQuizGameRepo.sendAnswerPlayer(
          firstPlayer.id,
          gameId,
          {
            addedAt: new Date().toISOString(),
            answerStatus: AnswerStatus.Incorrect,
            questionId: game.questions[answersLength].id,
          },
          '- 0',
        );
        answersLength++;
      }
      await this.pairQuizGameRepo.setFinishAnswerDateFirstPlayer(gameId);
      await this.changeStatusToFinishedUseCase.changeToFinished(gameId, game.questions);
    } else if (
      secondPlayer?.timeToAnswer &&
      secondPlayer.timeToAnswer < new Date().toISOString() &&
      game.status === GameStatus.Active
    ) {
      let answersLength: number;
      await this.pairQuizGameRepo.changeGameStatusToFinished(gameId);
      answersLength = secondPlayer.answers.length;
      while (answersLength < game.questions!.length) {
        await this.pairQuizGameRepo.sendAnswerPlayer(
          secondPlayer.id,
          gameId,
          {
            addedAt: new Date().toISOString(),
            answerStatus: AnswerStatus.Incorrect,
            questionId: game.questions[answersLength].id,
          },
          '- 0',
        );
        answersLength++;
      }
      await this.pairQuizGameRepo.setFinishAnswerDateSecondPlayer(gameId);
      await this.changeStatusToFinishedUseCase.changeToFinished(gameId, game.questions);
    }
    if (!player) {
      throw new ForbiddenException('You are not a participant in this game');
    } else {
      return await this.pairQuizGameQueryRepository.getGameById(gameId);
    }
  }
}
