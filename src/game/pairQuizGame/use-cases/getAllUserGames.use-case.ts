import { Injectable } from '@nestjs/common';
import { AuthService } from '../../../auth/application/auth.service';
import { sortDirectionHelper } from '../../../base/helpers/sortDirection.helper';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';

@Injectable()
export class GetAllUserGamesUseCase {
  constructor(
    private authService: AuthService,
    private pairQuizGameQueryRepository: PairQuizGameQueryRepository,
  ) {}

  async getGames(
    accessToken: string,
    sortBy: string = 'pairCreatedDate',
    sortDirection: string = 'desc',
    pageNumber: number = 1,
    pageSize: number = 10,
  ) {
    const userId = await this.authService.getUserIdByToken(accessToken.split(' ')[1]);
    const sortDir = sortDirectionHelper(sortDirection);
    return await this.pairQuizGameQueryRepository.getAllMyGames(
      userId,
      sortBy,
      sortDir,
      pageNumber,
      pageSize,
    );
  }
}
