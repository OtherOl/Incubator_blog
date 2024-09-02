import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestions } from '../domain/quizQuestions.entity';
import { Repository } from 'typeorm';
import { CreateQuestionModel } from '../../../common/types/game.model';

@Injectable()
export class QuizQuestionsRepository {
  constructor(@InjectRepository(QuizQuestions) private quizQuestionsRepository: Repository<QuizQuestions>) {}

  async createQuestion(question: QuizQuestions) {
    await this.quizQuestionsRepository.insert(question);
    return question;
  }

  async deleteQuestionById(id: string) {
    return await this.quizQuestionsRepository.delete({ id });
  }

  async updateQuestion(id: string, inputData: CreateQuestionModel) {
    return await this.quizQuestionsRepository.update(
      { id },
      { body: inputData.body, correctAnswers: inputData.correctAnswers, updatedAt: new Date().toISOString() },
    );
  }

  async updateQuestionPublished(id: string, published: boolean) {
    return await this.quizQuestionsRepository.update(
      { id },
      { published, updatedAt: new Date().toISOString() },
    );
  }
}
