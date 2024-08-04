import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionModel } from '../../../base/types/game.model';
import { QuizQuestionsQueryRepository } from '../repositories/quizQuestions.query-repository';
import { QuizQuestionsRepository } from '../repositories/quizQuestions.repository';

@Injectable()
export class UpdateQuestionUseCase {
  constructor(
    private quizQuestionsQueryRepository: QuizQuestionsQueryRepository,
    private quizQuestionsRepository: QuizQuestionsRepository,
  ) {}

  async updateQuestion(id: string, inputData: CreateQuestionModel) {
    const isExists = await this.quizQuestionsQueryRepository.getQuestionById(id);
    if (!isExists) throw new NotFoundException('Question doesnt exists');
    return await this.quizQuestionsRepository.updateQuestion(id, inputData);
  }
}
