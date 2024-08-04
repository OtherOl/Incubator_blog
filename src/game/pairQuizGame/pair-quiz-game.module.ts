import { Module } from '@nestjs/common';
import { PairQuizGameController } from './controller/pairQuizGame.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './domain/answers.entity';
import { PairQuizGame } from './domain/pairQuizGame.entity';
import { PlayerEntity } from './domain/player.entity';
import { PairQuizGameRepository } from './repositories/pairQuizGame.repository';
import { PairQuizGameQueryRepository } from './repositories/pairQuizGame.query-repository';
import { ChangeAnswerStatusFirstPlayerUseCase } from './use-cases/changeAnswerStatusFirstPlayer.use-case';
import { ChangeAnswerStatusSecondPlayerUseCase } from './use-cases/changeAnswerStatusSecondPlayer.use-case';
import { ChangeStatusToFinishedUseCase } from './use-cases/changeStatusToFinished.use-case';
import { CreateOrConnectGameUseCase } from './use-cases/createOrConnectGame.use-case';
import { FirstPlayerSendAnswerUseCase } from './use-cases/firstPlayerSendAnswer.use-case';
import { GetAllUserGamesUseCase } from './use-cases/getAllUserGames.use-case';
import { GetGameByIdUseCase } from './use-cases/getGameById.use-case';
import { GetStatisticUseCase } from './use-cases/getStatistic.use-case';
import { GetTopPlayersUseCase } from './use-cases/getTopPlayers.use-case';
import { GetUnfinishedGameUseCase } from './use-cases/getUnfinishedGame.use-case';
import { JoinOrCreateGameForMainUseCase } from './use-cases/joinOrCreateGameForMain.use-case';
import { SecondPlayerSendAnswerUseCase } from './use-cases/secondPlayerSendAnswer.use-case';
import { SendAnswersUseCase } from './use-cases/sendAnswers.use-case';
import { WinRateCountUseCase } from './use-cases/winRateCount.use-case';
import { AuthService } from '../../auth/application/auth.service';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';
import { QuizQuestionsQueryRepository } from '../quizQuestions/repositories/quizQuestions.query-repository';
import { UsersRepository } from '../../users/repositories/users.repository';
import { User } from '../../users/domain/users.entity';
import { QuizQuestions } from '../quizQuestions/domain/quizQuestions.entity';
import { GetAllQuestionsUseCase } from '../quizQuestions/use-cases/getAllQuestions.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, PairQuizGame, PlayerEntity, User, QuizQuestions])],
  controllers: [PairQuizGameController],
  providers: [
    PairQuizGameRepository,
    PairQuizGameQueryRepository,
    ChangeAnswerStatusFirstPlayerUseCase,
    ChangeAnswerStatusSecondPlayerUseCase,
    ChangeStatusToFinishedUseCase,
    CreateOrConnectGameUseCase,
    FirstPlayerSendAnswerUseCase,
    GetAllUserGamesUseCase,
    GetGameByIdUseCase,
    GetStatisticUseCase,
    GetTopPlayersUseCase,
    GetUnfinishedGameUseCase,
    JoinOrCreateGameForMainUseCase,
    SecondPlayerSendAnswerUseCase,
    SendAnswersUseCase,
    WinRateCountUseCase,
    AuthService,
    UsersRepository,
    UsersQueryRepository,
    QuizQuestionsQueryRepository,
    GetAllQuestionsUseCase,
  ],
})
export class PairQuizGameModule {}
