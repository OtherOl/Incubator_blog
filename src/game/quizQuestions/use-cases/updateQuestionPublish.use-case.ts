import { Injectable, NotFoundException } from '@nestjs/common';
import { QuizQuestionsRepository } from '../repositories/quizQuestions.repository';
import { QuizQuestionsQueryRepository } from '../repositories/quizQuestions.query-repository';

@Injectable()
export class UpdateQuestionPublishUseCase {
  constructor(
    private quizQuestionsRepository: QuizQuestionsRepository,
    private quizQuestionsQueryRepository: QuizQuestionsQueryRepository,
  ) {}

  async updateQuestion(id: string, published: boolean) {
    const isExists = await this.quizQuestionsQueryRepository.getQuestionById(id);
    if (!isExists) throw new NotFoundException("Questions doesn't exists");
    await this.quizQuestionsRepository.updateQuestionPublished(id, published);
    return;
  }
}
