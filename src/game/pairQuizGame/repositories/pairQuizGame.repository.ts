import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PairQuizGame } from '../domain/pairQuizGame.entity';
import { Repository } from 'typeorm';
import { AnswerViewModel, GameStatus, PlayerGameModel, PlayerType } from '../../../base/types/game.model';
import { Answer } from '../domain/answers.entity';
import { PlayerEntity } from '../domain/player.entity';

@Injectable()
export class PairQuizGameRepository {
  constructor(
    @InjectRepository(PlayerEntity) private readonly playerRepository: Repository<PlayerEntity>,
    @InjectRepository(PairQuizGame) private pairQuizGameRepository: Repository<PairQuizGame>,
    @InjectRepository(Answer) private answerRepository: Repository<Answer>,
  ) {}

  async createGame(newGame: PairQuizGame) {
    return await this.pairQuizGameRepository.insert(newGame);
  }

  async insertPlayer(gameId: string, firstPlayer: PlayerGameModel) {
    return await this.pairQuizGameRepository.update({ id: gameId }, { firstPlayerProgress: firstPlayer });
  }

  async createPlayer(playerModel: PlayerEntity) {
    return await this.playerRepository.insert(playerModel);
  }

  async changeGameStatusToActive(gameId: string, secondPlayer: PlayerGameModel) {
    return await this.pairQuizGameRepository.update(
      { id: gameId },
      {
        status: GameStatus.Active,
        startGameDate: new Date().toISOString(),
        secondPlayerProgress: secondPlayer,
      },
    );
  }

  async changeGameStatusToFinished(gameId: string) {
    return await this.pairQuizGameRepository.update(
      { id: gameId },
      { status: GameStatus.Finished, finishGameDate: new Date().toISOString() },
    );
  }

  async createAnswer(answer: Answer) {
    return await this.answerRepository.insert(answer);
  }

  async sendAnswerPlayer(playerId: string, gameId: string, answer: AnswerViewModel, score: string) {
    return await this.playerRepository
      .createQueryBuilder()
      .update()
      .set({
        answers: () =>
          `"answers" || '{"addedAt": "${answer.addedAt}", "answerStatus": "${answer.answerStatus}", "questionId": "${answer.questionId}"}' ::jsonb`,
        score: () => `score ${score}`,
      })
      .where('gameId = :gameId', { gameId })
      .andWhere('id = :playerId', { playerId })
      .execute();
  }

  async setFinishAnswerDateFirstPlayer(gameId: string) {
    return await this.playerRepository.update(
      { gameId, playerType: PlayerType.FirstPlayer },
      { answerFinishDate: new Date().toISOString() },
    );
  }

  async setFinishAnswerDateSecondPlayer(gameId: string) {
    return await this.playerRepository.update(
      { gameId, playerType: PlayerType.SecondPlayer },
      { answerFinishDate: new Date().toISOString() },
    );
  }

  async addBonusFirstPlayer(gameId: string) {
    return await this.playerRepository
      .createQueryBuilder()
      .update()
      .set({ score: () => 'score + 1' })
      .where('gameId = :gameId', { gameId })
      .andWhere('playerType = :type', { type: PlayerType.FirstPlayer })
      .execute();
  }

  async addBonusSecondPlayer(gameId: string) {
    return await this.playerRepository
      .createQueryBuilder()
      .update()
      .set({ score: () => 'score + 1' })
      .where('gameId = :gameId', { gameId })
      .andWhere('playerType = :type', { type: PlayerType.SecondPlayer })
      .execute();
  }

  async increaseGamesCountFirstPlayer(gameId: string) {
    return await this.playerRepository
      .createQueryBuilder()
      .update()
      .set({ gamesCount: () => 'gamesCount + 1' })
      .where('gameId = :gameId', { gameId })
      .andWhere('playerType = :type', { type: PlayerType.FirstPlayer })
      .execute();
  }

  async increaseGamesCountSecondPlayer(gameId: string) {
    return await this.playerRepository
      .createQueryBuilder()
      .update()
      .set({ gamesCount: () => 'gamesCount + 1' })
      .where('gameId = :gameId', { gameId })
      .andWhere('playerType = :type', { type: PlayerType.SecondPlayer })
      .execute();
  }

  async increaseWinsCountFirstPlayer(gameId: string) {
    return await this.playerRepository
      .createQueryBuilder()
      .update()
      .set({ winsCount: () => 'winsCount + 1' })
      .where('gameId = :gameId', { gameId })
      .andWhere('playerType = :type', { type: PlayerType.FirstPlayer })
      .execute();
  }

  async increaseWinsCountSecondPlayer(gameId: string) {
    return await this.playerRepository
      .createQueryBuilder()
      .update()
      .set({ winsCount: () => 'winsCount + 1' })
      .where('gameId = :gameId', { gameId })
      .andWhere('playerType = :type', { type: PlayerType.SecondPlayer })
      .execute();
  }

  async increaseLossesCountFirstPlayer(gameId: string) {
    return await this.playerRepository
      .createQueryBuilder()
      .update()
      .set({ lossesCount: () => 'lossesCount + 1' })
      .where('gameId = :gameId', { gameId })
      .andWhere('playerType = :type', { type: PlayerType.FirstPlayer })
      .execute();
  }

  async increaseLossesCountSecondPlayer(gameId: string) {
    return await this.playerRepository
      .createQueryBuilder()
      .update()
      .set({ lossesCount: () => 'lossesCount + 1' })
      .where('gameId = :gameId', { gameId })
      .andWhere('playerType = :type', { type: PlayerType.SecondPlayer })
      .execute();
  }

  async increaseDrawCount(gameId: string) {
    await this.playerRepository
      .createQueryBuilder()
      .update()
      .set({ drawsCount: () => 'drawsCount + 1' })
      .where('gameId = :gameId', { gameId })
      .andWhere('playerType = :type', { type: PlayerType.FirstPlayer })
      .execute();

    return await this.playerRepository
      .createQueryBuilder()
      .update()
      .set({ drawsCount: () => 'drawsCount + 1' })
      .where('gameId = :gameId', { gameId })
      .andWhere('playerType = :type', { type: PlayerType.SecondPlayer })
      .execute();
  }
}
