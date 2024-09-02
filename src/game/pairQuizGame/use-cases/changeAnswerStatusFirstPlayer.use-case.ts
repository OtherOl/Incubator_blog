import { Injectable } from '@nestjs/common';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';
import { PairQuizGameRepository } from '../repositories/pairQuizGame.repository';
import { QuestionsViewModel } from '../../../common/types/game.model';

@Injectable()
export class ChangeAnswerStatusFirstPlayerUseCase {
  constructor(
    private pairQuizGameQueryRepository: PairQuizGameQueryRepository,
    private pairQuizGameRepository: PairQuizGameRepository,
  ) {}

  async changeStatus(gameId: string, gameQuestions: QuestionsViewModel[]) {
    const firstPlayer = await this.pairQuizGameQueryRepository.getFirstPlayerByGameId(gameId);
    if (firstPlayer!.answers.length === gameQuestions.length) {
      return await this.pairQuizGameRepository.setFinishAnswerDateFirstPlayer(gameId);
    } else {
      return;
    }
  }
}
