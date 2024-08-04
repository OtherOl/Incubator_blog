import { Injectable } from '@nestjs/common';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';
import { PairQuizGameRepository } from '../repositories/pairQuizGame.repository';

@Injectable()
export class WinRateCountUseCase {
  constructor(
    private pairQuizGameQueryRepository: PairQuizGameQueryRepository,
    private pairQuizGameRepository: PairQuizGameRepository,
  ) {}

  async changeWinRate(gameId: string) {
    const firstPlayer = await this.pairQuizGameQueryRepository.getFirstPlayerByGameId(gameId);
    const secondPlayer = await this.pairQuizGameQueryRepository.getSecondPlayerByGameId(gameId);
    if (firstPlayer!.score > secondPlayer!.score) {
      await this.pairQuizGameRepository.increaseWinsCountFirstPlayer(gameId);
      return await this.pairQuizGameRepository.increaseLossesCountSecondPlayer(gameId);
    } else if (firstPlayer!.score < secondPlayer!.score) {
      await this.pairQuizGameRepository.increaseWinsCountSecondPlayer(gameId);
      return await this.pairQuizGameRepository.increaseLossesCountFirstPlayer(gameId);
    } else if (firstPlayer!.score === secondPlayer!.score) {
      return await this.pairQuizGameRepository.increaseDrawCount(gameId);
    }
  }
}
