import { Injectable } from '@nestjs/common';
import { CreateQuestionModel } from '../../../common/types/game.model';
import { QuizQuestions } from '../entities/quizQuestions.entity';
import { QuizQuestionsRepository } from '../repositories/quizQuestions.repository';

@Injectable()
export class CreateQuizQuestionsUseCase {
  constructor(private quizQuestionRepository: QuizQuestionsRepository) {}

  async createQuestion(inputData: CreateQuestionModel) {
    const createdQuestion = QuizQuestions.createQuestion(inputData);
    return await this.quizQuestionRepository.createQuestion(createdQuestion);
  }
}
