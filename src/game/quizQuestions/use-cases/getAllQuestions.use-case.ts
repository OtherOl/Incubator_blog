import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizQuestions } from '../entities/quizQuestions.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetAllQuestionsUseCase {
  constructor(@InjectRepository(QuizQuestions) private quizQuestionsRepository: Repository<QuizQuestions>) {}

  async getAllQuestions(
    publishedStatus: string,
    bodySearchTerm: string,
    sortBy: string,
    sortDir: 'ASC' | 'DESC',
    pageNumber: number,
    pageSize: number,
  ) {
    if (publishedStatus === 'all') {
      const countedQuestions = await this.quizQuestionsRepository
        .createQueryBuilder('q')
        .where('q.body ilike :body', { body: `%${bodySearchTerm}%` })
        .getCount();

      const questions = await this.quizQuestionsRepository
        .createQueryBuilder('q')
        .where('q.body ilike :body', { body: `%${bodySearchTerm}%` })
        .orderBy(`q.${sortBy}`, sortDir)
        .limit(pageSize)
        .offset((pageNumber - 1) * pageSize)
        .getMany();
      return {
        countedQuestions,
        questions,
      };
    }
    if (publishedStatus === 'published') {
      const countedQuestions = await this.quizQuestionsRepository
        .createQueryBuilder('q')
        .where('q.body ilike :body', { body: `%${bodySearchTerm}%` })
        .andWhere('q.published = true')
        .getCount();

      const questions = await this.quizQuestionsRepository
        .createQueryBuilder('q')
        .where('q.body ilike :body', { body: `%${bodySearchTerm}%` })
        .andWhere('q.published = true')
        .orderBy(`q.${sortBy}`, sortDir)
        .limit(pageSize)
        .offset((pageNumber - 1) * pageSize)
        .getMany();

      return {
        countedQuestions,
        questions,
      };
    }
    if (publishedStatus === 'notPublished') {
      const countedQuestions = await this.quizQuestionsRepository
        .createQueryBuilder('q')
        .where('q.body ilike :body', { body: `%${bodySearchTerm}%` })
        .andWhere('q.published = false')
        .getCount();

      const questions = await this.quizQuestionsRepository
        .createQueryBuilder('q')
        .where('q.body ilike :body', { body: `%${bodySearchTerm}%` })
        .andWhere('q.published = false')
        .orderBy(`q.${sortBy}`, sortDir)
        .limit(pageSize)
        .offset((pageNumber - 1) * pageSize)
        .getMany();

      return {
        countedQuestions,
        questions,
      };
    }
    const countedQuestions = await this.quizQuestionsRepository
      .createQueryBuilder('q')
      .where('q.body ilike :body', { body: `%${bodySearchTerm}%` })
      .getCount();

    const questions = await this.quizQuestionsRepository
      .createQueryBuilder('q')
      .where('q.body ilike :body', { body: `%${bodySearchTerm}%` })
      .orderBy(`q.${sortBy}`, sortDir)
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .getMany();

    return {
      countedQuestions,
      questions,
    };
  }
}
