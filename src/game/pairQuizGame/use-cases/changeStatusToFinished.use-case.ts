import { Injectable } from '@nestjs/common';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';
import { PairQuizGameRepository } from '../repositories/pairQuizGame.repository';
import { QuestionsViewModel } from '../../../base/types/game.model';
import { WinRateCountUseCase } from './winRateCount.use-case';

@Injectable()
export class ChangeStatusToFinishedUseCase {
  constructor(
    private pairQuizGameQueryRepository: PairQuizGameQueryRepository,
    private pairQuizGameRepository: PairQuizGameRepository,
    private winRateCountUseCase: WinRateCountUseCase,
  ) {}

  async changeToFinished(gameId: string, gameQuestions: QuestionsViewModel[]) {
    const firstPlayer = await this.pairQuizGameQueryRepository.getFirstPlayerByGameId(gameId);
    const secondPlayer = await this.pairQuizGameQueryRepository.getSecondPlayerByGameId(gameId);
    if (
      firstPlayer!.answers.length === gameQuestions.length &&
      secondPlayer!.answers.length === gameQuestions.length
    ) {
      await this.pairQuizGameRepository.increaseGamesCountFirstPlayer(gameId);
      await this.pairQuizGameRepository.increaseGamesCountSecondPlayer(gameId);
      if (firstPlayer!.answerFinishDate < secondPlayer!.answerFinishDate && firstPlayer!.score >= 1) {
        await this.pairQuizGameRepository.addBonusFirstPlayer(gameId);
        await this.winRateCountUseCase.changeWinRate(gameId);
        return await this.pairQuizGameRepository.changeGameStatusToFinished(gameId);
      }
      if (secondPlayer!.answerFinishDate < firstPlayer!.answerFinishDate && secondPlayer!.score >= 1) {
        await this.pairQuizGameRepository.addBonusSecondPlayer(gameId);
        await this.winRateCountUseCase.changeWinRate(gameId);
        return await this.pairQuizGameRepository.changeGameStatusToFinished(gameId);
      }
      if (firstPlayer!.score > secondPlayer!.score) {
        await this.winRateCountUseCase.changeWinRate(gameId);
        return await this.pairQuizGameRepository.changeGameStatusToFinished(gameId);
      } else {
        await this.winRateCountUseCase.changeWinRate(gameId);
        return await this.pairQuizGameRepository.changeGameStatusToFinished(gameId);
      }
    }
  }
}
