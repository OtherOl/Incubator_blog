import { Injectable, NotFoundException } from '@nestjs/common';
import { QuizQuestionsRepository } from '../repositories/quizQuestions.repository';
import { QuizQuestionsQueryRepository } from '../repositories/quizQuestions.query-repository';

@Injectable()
export class DeleteQuestionByIdUseCase {
  constructor(
    private quizQuestionsRepository: QuizQuestionsRepository,
    private quizQuestionsQueryRepository: QuizQuestionsQueryRepository,
  ) {}

  async deleteQuestion(id: string) {
    const isExists = await this.quizQuestionsQueryRepository.getQuestionById(id);
    if (!isExists) throw new NotFoundException("Question doesn't exists");
    await this.quizQuestionsRepository.deleteQuestionById(id);
    return;
  }
}
