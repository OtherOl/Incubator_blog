import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PairQuizGame } from '../domain/pairQuizGame.entity';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { GameStatus, PlayerType } from '../../../base/types/game.model';
import { PlayerEntity } from '../domain/player.entity';

@Injectable()
export class PairQuizGameQueryRepository {
  constructor(
    @InjectRepository(PlayerEntity) private readonly playerRepository: Repository<PlayerEntity>,
    @InjectRepository(PairQuizGame) private pairQuizGameRepository: Repository<PairQuizGame>,
  ) {}

  async getFirstPlayerByGameId(gameId: string) {
    return await this.playerRepository
      .createQueryBuilder('p')
      .select()
      .where('p.gameId = :gameId', { gameId })
      .andWhere('p.playerType = :type', { type: PlayerType.FirstPlayer })
      .getOne();
  }

  async getSecondPlayerByGameId(gameId: string) {
    return await this.playerRepository
      .createQueryBuilder('p')
      .select()
      .where('p.gameId = :gameId', { gameId })
      .andWhere('p.playerType = :type', { type: PlayerType.SecondPlayer })
      .getOne();
  }

  async getPlayerByGameIdUserId(gameId: string, userId: string) {
    return await this.playerRepository
      .createQueryBuilder('p')
      .select()
      .where('p.gameId = :gameId', { gameId })
      .andWhere('p.player ::jsonb @> :player', {
        player: {
          id: userId,
        },
      })
      .getOne();
  }

  async getGameById(gameId: string) {
    const game = await this.pairQuizGameRepository
      .createQueryBuilder('g')
      .where('g.id = :gameId', { gameId })
      .getOne();

    const firstPlayer = await this.playerRepository
      .createQueryBuilder('p')
      .select(['p.answers', 'p.player', 'p.score'])
      .where('p.gameId = :gameId', { gameId })
      .andWhere('p.playerType = :type', { type: PlayerType.FirstPlayer })
      .getOne();

    const secondPlayer = await this.playerRepository
      .createQueryBuilder('p')
      .select(['p.answers', 'p.player', 'p.score'])
      .where('p.gameId = :gameId', { gameId })
      .andWhere('p.playerType = :type', { type: PlayerType.SecondPlayer })
      .getOne();

    if (!game) {
      return null;
    } else if (game.status === 'PendingSecondPlayer') {
      return {
        id: game.id,
        firstPlayerProgress: firstPlayer,
        secondPlayerProgress: secondPlayer,
        questions: null,
        status: game.status,
        pairCreatedDate: game.pairCreatedDate,
        startGameDate: game.startGameDate,
        finishGameDate: game.finishGameDate,
      };
    } else {
      return {
        id: game.id,
        firstPlayerProgress: firstPlayer,
        secondPlayerProgress: secondPlayer,
        questions: game.questions,
        status: game.status,
        pairCreatedDate: game.pairCreatedDate,
        startGameDate: game.startGameDate,
        finishGameDate: game.finishGameDate,
      };
    }
  }

  async getGameByStatus(status: GameStatus) {
    return await this.pairQuizGameRepository.findOneBy({ status });
  }

  async getUnfinishedGame(userId: string) {
    const game = await this.pairQuizGameRepository
      .createQueryBuilder('g')
      .where('g.status != :status', { status: GameStatus.Finished })
      .andWhere(
        new Brackets((qb) => {
          qb.where('g.firstPlayerProgress :: jsonb @> :firstPlayerProgress', {
            firstPlayerProgress: {
              player: { id: userId },
            },
          }).orWhere('g.secondPlayerProgress :: jsonb @> :secondPlayerProgress', {
            secondPlayerProgress: {
              player: { id: userId },
            },
          });
        }),
      )
      .getOne();

    if (!game) return null;
    if (game.status === 'PendingSecondPlayer') {
      return {
        id: game.id,
        firstPlayerProgress: game.firstPlayerProgress,
        secondPlayerProgress: game.secondPlayerProgress,
        questions: null,
        status: game.status,
        pairCreatedDate: game.pairCreatedDate,
        startGameDate: game.startGameDate,
        finishGameDate: game.finishGameDate,
      };
    } else {
      return {
        id: game.id,
        firstPlayerProgress: game.firstPlayerProgress,
        secondPlayerProgress: game.secondPlayerProgress,
        questions: game.questions,
        status: game.status,
        pairCreatedDate: game.pairCreatedDate,
        startGameDate: game.startGameDate,
        finishGameDate: game.finishGameDate,
      };
    }
  }

  async getAllMyGames(
    userId: string,
    sortBy: string,
    sortDirection: 'ASC' | 'DESC',
    pageNumber: number,
    pageSize: number,
  ) {
    const countGames = await this.pairQuizGameRepository
      .createQueryBuilder('g')
      .where(
        new Brackets((qb) => {
          qb.where('g.firstPlayerProgress :: jsonb @> :firstPlayerProgress', {
            firstPlayerProgress: {
              player: { id: userId },
            },
          }).orWhere('g.secondPlayerProgress :: jsonb @> :secondPlayerProgress', {
            secondPlayerProgress: {
              player: { id: userId },
            },
          });
        }),
      )
      .getCount();

    const game = await this.pairQuizGameRepository
      .createQueryBuilder('g')
      .where(
        new Brackets((qb) => {
          qb.where('g.firstPlayerProgress :: jsonb @> :firstPlayerProgress', {
            firstPlayerProgress: {
              player: { id: userId },
            },
          }).orWhere('g.secondPlayerProgress :: jsonb @> :secondPlayerProgress', {
            secondPlayerProgress: {
              player: { id: userId },
            },
          });
        }),
      )
      .orderBy(`g.${sortBy}`, sortDirection)
      .addOrderBy('g.pairCreatedDate', 'DESC')
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .getMany();

    const userGames = game.map((game) => {
      return {
        id: game.id,
        firstPlayerProgress: game.firstPlayerProgress,
        secondPlayerProgress: game.secondPlayerProgress,
        questions: game.questions,
        status: game.status,
        pairCreatedDate: game.pairCreatedDate,
        startGameDate: game.startGameDate,
        finishGameDate: game.finishGameDate,
      };
    });

    return {
      pagesCount: Math.ceil(Number(countGames) / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: Number(countGames),
      items: userGames,
    };
  }

  async getMyStatistic(userId: string) {
    const player = await this.playerRepository
      .createQueryBuilder('f')
      .select([
        'COALESCE(Sum(f.winsCount), 0) as "winsCount"',
        'COALESCE(Sum(f.lossesCount), 0) as "lossesCount"',
        'COALESCE(Sum(f.drawsCount), 0) as "drawsCount"',
        'COALESCE(Sum(f.gamesCount), 0) as "gamesCount"',
        'COALESCE(Sum(f.score), 0) as "score"',
        'COALESCE(AVG(f.score), 0) as "avgScores"',
      ])
      .where('f.player ::jsonb @> :player', {
        player: {
          id: userId,
        },
      })
      .getRawOne();

    return {
      sumScore: +player.score,
      avgScores: +player.avgScores,
      gamesCount: +player.gamesCount,
      winsCount: +player.winsCount,
      lossesCount: +player.lossesCount,
      drawsCount: +player.drawsCount,
    };
  }

  async getTopPlayers(queryBuilder: SelectQueryBuilder<PairQuizGame>) {
    return await queryBuilder.getMany();
  }
}
