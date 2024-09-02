import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from '../../../auth/guards/basic-auth.guard';
import { QuizQuestionsQueryRepository } from '../repositories/quizQuestions.query-repository';
import { CreateQuestionModel, UpdatePublished } from '../../../common/types/game.model';
import { CreateQuizQuestionsUseCase } from '../use-cases/createQuizQuestions.use-case';
import { DeleteQuestionByIdUseCase } from '../use-cases/deleteQuestionById.use-case';
import { UpdateQuestionUseCase } from '../use-cases/updateQuestion.use-case';
import { UpdateQuestionPublishUseCase } from '../use-cases/updateQuestionPublish.use-case';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('sa/quiz/questions')
export class QuizQuestionsController {
  constructor(
    private quizQuestionsQueryRepository: QuizQuestionsQueryRepository,
    private createQuizQuestionsUseCase: CreateQuizQuestionsUseCase,
    private deleteQuestionByIdUseCase: DeleteQuestionByIdUseCase,
    private updateQuestionUseCase: UpdateQuestionUseCase,
    private updateQuestionPublishUseCase: UpdateQuestionPublishUseCase,
  ) {}

  @Get()
  @UseGuards(BasicAuthGuard)
  @SkipThrottle()
  @HttpCode(200)
  async getAllQuestions(
    @Query()
    query: {
      bodySearchTerm: string;
      publishedStatus: string;
      sortBy: string;
      sortDirection: string;
      pageNumber: number;
      pageSize: number;
    },
  ) {
    return await this.quizQuestionsQueryRepository.getAllQuestions(
      query.bodySearchTerm,
      query.publishedStatus,
      query.sortBy,
      query.sortDirection,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
    );
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  @SkipThrottle()
  @HttpCode(201)
  async createQuestion(@Body() inputData: CreateQuestionModel) {
    return await this.createQuizQuestionsUseCase.createQuestion(inputData);
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @SkipThrottle()
  @HttpCode(204)
  async updateQuestion(@Param('id') id: string, @Body() inputData: CreateQuestionModel) {
    return await this.updateQuestionUseCase.updateQuestion(id, inputData);
  }

  @Put(':id/publish')
  @UseGuards(BasicAuthGuard)
  @SkipThrottle()
  @HttpCode(204)
  async updateQuestionPublish(@Param('id') id: string, @Body() published: UpdatePublished) {
    return await this.updateQuestionPublishUseCase.updateQuestion(id, published.published);
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @SkipThrottle()
  @HttpCode(204)
  async deleteQuestionById(@Param('id') id: string) {
    return await this.deleteQuestionByIdUseCase.deleteQuestion(id);
  }
}
