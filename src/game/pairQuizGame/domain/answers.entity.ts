import { Column, Entity, PrimaryColumn } from 'typeorm';
import { AnswerStatus } from '../../../base/types/game.model';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'Answer' })
export class Answer {
  @PrimaryColumn()
  id: string;

  @Column()
  questionId: string;

  @Column({ enum: AnswerStatus })
  answerStatus: AnswerStatus;

  @Column()
  addedAt: string;

  static createAnswer(questionId: string, status: AnswerStatus) {
    const answer = new Answer();

    answer.id = uuidv4();
    answer.questionId = questionId;
    answer.answerStatus = status;
    answer.addedAt = new Date().toISOString();

    return answer;
  }
}
