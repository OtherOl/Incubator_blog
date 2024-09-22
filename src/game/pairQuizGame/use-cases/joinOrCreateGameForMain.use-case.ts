import { Injectable } from '@nestjs/common';
import { GameStatus, PlayerType, QuestionsViewModel } from '../../../common/types/game.model';
import { PairQuizGame } from '../entities/pairQuizGame.entity';
import { PairQuizGameRepository } from '../repositories/pairQuizGame.repository';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';
import { User } from '../../../users/entities/users.entity';
import { QuizQuestionsQueryRepository } from '../../quizQuestions/repositories/quizQuestions.query-repository';
import { PlayerEntity } from '../entities/player.entity';

@Injectable()
export class JoinOrCreateGameForMainUseCase {
  constructor(
    private quizQuestionsQueryRepository: QuizQuestionsQueryRepository,
    private pairQuizGameRepository: PairQuizGameRepository,
    private pairQuizGameQueryRepository: PairQuizGameQueryRepository,
  ) {}

  async joinOrCreateGame(userId: string, user: User) {
    const game = await this.pairQuizGameQueryRepository.getGameByStatus(GameStatus.PendingSecondPlayer);
    if (!game) {
      const questions: QuestionsViewModel[] = await this.quizQuestionsQueryRepository.getQuestionsForGame();
      const newGame = PairQuizGame.createGame(questions);
      await this.pairQuizGameRepository.createGame(newGame);
      const firstPlayer = PlayerEntity.createPlayer(userId, user.login, newGame.id, PlayerType.FirstPlayer);
      await this.pairQuizGameRepository.createPlayer(firstPlayer);
      await this.pairQuizGameRepository.insertPlayer(newGame.id, {
        answers: firstPlayer.answers,
        player: firstPlayer.player,
        score: firstPlayer.score,
      });
      return await this.pairQuizGameQueryRepository.getGameById(newGame.id);
    } else {
      const secondPlayer = PlayerEntity.createPlayer(userId, user!.login, game.id, PlayerType.SecondPlayer);
      await this.pairQuizGameRepository.createPlayer(secondPlayer);
      await this.pairQuizGameRepository.changeGameStatusToActive(game.id, {
        answers: secondPlayer.answers,
        player: secondPlayer.player,
        score: secondPlayer.score,
      });
      return await this.pairQuizGameQueryRepository.getGameById(game.id);
    }
  }
}
