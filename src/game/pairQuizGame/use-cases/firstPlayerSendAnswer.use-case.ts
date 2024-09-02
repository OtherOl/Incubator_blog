import { ForbiddenException, Injectable } from '@nestjs/common';
import { AnswerStatus, QuestionsViewModel } from '../../../common/types/game.model';
import { Answer } from '../domain/answers.entity';
import { PairQuizGameRepository } from '../repositories/pairQuizGame.repository';
import { QuizQuestionsQueryRepository } from '../../quizQuestions/repositories/quizQuestions.query-repository';
import { ChangeStatusToFinishedUseCase } from './changeStatusToFinished.use-case';
import { ChangeAnswerStatusFirstPlayerUseCase } from './changeAnswerStatusFirstPlayer.use-case';
import { PlayerEntity } from '../domain/player.entity';

@Injectable()
export class FirstPlayerSendAnswerUseCase {
  constructor(
    private pairQuizGameRepository: PairQuizGameRepository,
    private quizQuestionsQueryRepository: QuizQuestionsQueryRepository,
    private changeStatusToFinishedUseCase: ChangeStatusToFinishedUseCase,
    private changeAnswerStatusFirstPlayerUseCase: ChangeAnswerStatusFirstPlayerUseCase,
  ) {}

  async sendAnswer(
    player: PlayerEntity,
    gameId: string,
    gameQuestions: QuestionsViewModel[],
    inputAnswer: string,
  ) {
    if (player.answers.length === gameQuestions.length) {
      throw new ForbiddenException('You already answered all questions');
    } else {
      const questionNumber: number = player.answers.length;
      const gameQuestion: QuestionsViewModel = gameQuestions[questionNumber];
      const question = await this.quizQuestionsQueryRepository.getQuestionById(gameQuestion.id);
      if (question!.correctAnswers.includes(inputAnswer)) {
        const answer = Answer.createAnswer(question!.id, AnswerStatus.Correct);
        await this.pairQuizGameRepository.createAnswer(answer);
        await this.pairQuizGameRepository.sendAnswerPlayer(
          player.id,
          gameId,
          {
            addedAt: answer.addedAt,
            answerStatus: answer.answerStatus,
            questionId: answer.questionId,
          },
          '+ 1',
        );
        await this.changeAnswerStatusFirstPlayerUseCase.changeStatus(gameId, gameQuestions);
        await this.changeStatusToFinishedUseCase.changeToFinished(gameId, gameQuestions);
        return {
          addedAt: answer.addedAt,
          answerStatus: answer.answerStatus,
          questionId: answer.questionId,
        };
      } else if (!question!.correctAnswers.includes(inputAnswer)) {
        const answer = Answer.createAnswer(question!.id, AnswerStatus.Incorrect);
        await this.pairQuizGameRepository.createAnswer(answer);
        await this.pairQuizGameRepository.sendAnswerPlayer(
          player.id,
          gameId,
          {
            addedAt: answer.addedAt,
            answerStatus: answer.answerStatus,
            questionId: answer.questionId,
          },
          '- 0',
        );
        await this.changeAnswerStatusFirstPlayerUseCase.changeStatus(gameId, gameQuestions);
        await this.changeStatusToFinishedUseCase.changeToFinished(gameId, gameQuestions);
        return {
          addedAt: answer.addedAt,
          answerStatus: answer.answerStatus,
          questionId: answer.questionId,
        };
      }
    }
  }
}
