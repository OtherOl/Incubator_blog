import { Injectable } from '@nestjs/common';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';

@Injectable()
export class GetTopPlayersUseCase {
  constructor(private pairQuizGameQueryRepository: PairQuizGameQueryRepository) {}

  async getTopPlayers(
    inputSort: string | string[] = ['avgScores DESC', 'sumScore DESC'],
    pageNumber: number = 1,
    pageSize: number = 10,
  ) {
    return await this.pairQuizGameQueryRepository.getTopPlayers(pageNumber, pageSize, inputSort);
  }
}
