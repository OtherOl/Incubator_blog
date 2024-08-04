import { Module } from '@nestjs/common';
import { QuizQuestionsController } from './controller/quizQuestions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizQuestions } from './domain/quizQuestions.entity';
import { QuizQuestionsRepository } from './repositories/quizQuestions.repository';
import { QuizQuestionsQueryRepository } from './repositories/quizQuestions.query-repository';
import { CreateQuizQuestionsUseCase } from './use-cases/createQuizQuestions.use-case';
import { DeleteQuestionByIdUseCase } from './use-cases/deleteQuestionById.use-case';
import { GetAllQuestionsUseCase } from './use-cases/getAllQuestions.use-case';
import { UpdateQuestionUseCase } from './use-cases/updateQuestion.use-case';
import { UpdateQuestionPublishUseCase } from './use-cases/updateQuestionPublish.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([QuizQuestions])],
  controllers: [QuizQuestionsController],
  providers: [
    QuizQuestionsRepository,
    QuizQuestionsQueryRepository,
    CreateQuizQuestionsUseCase,
    DeleteQuestionByIdUseCase,
    GetAllQuestionsUseCase,
    UpdateQuestionUseCase,
    UpdateQuestionPublishUseCase,
  ],
})
export class QuizQuestionsModule {}
