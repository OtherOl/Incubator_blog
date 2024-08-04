import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { sortDirectionHelper } from '../../../base/helpers/sortDirection.helper';

@Injectable()
export class GetTopPlayersUseCase {
  constructor() {}

  async getTopPlayers(
    inputSort: string | string[] = ['avgScores DESC', 'sumScore DESC'],
    pageNumber: number = 1,
    pageSize: number = 10,
  ) {
    //   const sorts = Array.isArray(inputSort) ? inputSort : [inputSort];
    //
    //   const queryBuilder: SelectQueryBuilder<> = this.gameRepository.createQueryBuilder();
    //   sorts.forEach((sort) => {
    //     const fieldName = sort.split(' ')[0];
    //     const sortDirection = sortDirectionHelper(sort.split(' ')[1]);
    //     queryBuilder.orderBy(fieldName, sortDirection);
    //   });
    //   return await queryBuilder.getMany();
  }
}
