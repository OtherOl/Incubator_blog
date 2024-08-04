import { Injectable } from '@nestjs/common';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';
import { PairQuizGameRepository } from '../repositories/pairQuizGame.repository';
import { QuestionsViewModel } from '../../../base/types/game.model';

@Injectable()
export class ChangeAnswerStatusSecondPlayerUseCase {
  constructor(
    private pairQuizGameQueryRepository: PairQuizGameQueryRepository,
    private pairQuizGameRepository: PairQuizGameRepository,
  ) {}

  async changeStatus(gameId: string, gameQuestions: QuestionsViewModel[]) {
    const secondPlayer = await this.pairQuizGameQueryRepository.getSecondPlayerByGameId(gameId);
    if (secondPlayer!.answers.length === gameQuestions.length) {
      return await this.pairQuizGameRepository.setFinishAnswerDateSecondPlayer(gameId);
    } else {
      return;
    }
  }
}
