import { Column, Entity, PrimaryColumn } from 'typeorm';
import { CreateQuestionModel } from '../../../base/types/game.model';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'QuizQuestions' })
export class QuizQuestions {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  body: string;

  @Column({ type: 'jsonb' })
  correctAnswers: string[];

  @Column({ default: false })
  published: boolean;

  @Column()
  createdAt: string;

  @Column({ nullable: true, default: null })
  updatedAt: string;

  static createQuestion(inputData: CreateQuestionModel) {
    const question = new QuizQuestions();

    question.id = uuidv4();
    question.body = inputData.body;
    question.correctAnswers = inputData.correctAnswers;
    question.createdAt = new Date().toISOString();

    return question;
  }
}
