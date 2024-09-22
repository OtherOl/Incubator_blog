import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { GameStatus, QuestionsViewModel } from '../../../common/types/game.model';
import { v4 as uuidv4 } from 'uuid';
import { PlayerEntity } from './player.entity';

@Entity({ name: 'PairQuizGame' })
export class PairQuizGame {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'jsonb', nullable: true, foreignKeyConstraintName: 'firstPlayer' })
  firstPlayerProgress: null | PlayerEntity;

  @OneToMany(() => PlayerEntity, (p) => p.id)
  @JoinColumn({ name: 'firstPlayer' })
  firstPlayer: PlayerEntity;

  @Column({ type: 'jsonb', nullable: true, foreignKeyConstraintName: 'secondPlayer' })
  secondPlayerProgress: null | PlayerEntity;

  @OneToMany(() => PlayerEntity, (p) => p.id)
  @JoinColumn({ name: 'secondPlayer' })
  secondPlayer: PlayerEntity;

  @Column({ nullable: true, type: 'jsonb' })
  questions: QuestionsViewModel[];

  @Column({ enum: GameStatus })
  status: GameStatus;

  @Column()
  pairCreatedDate: string;

  @Column({ nullable: true, default: null })
  startGameDate: string;

  @Column({ nullable: true, default: null })
  finishGameDate: string;

  static createGame(questions: QuestionsViewModel[]) {
    const game = new PairQuizGame();

    game.id = uuidv4();
    game.questions = questions;
    game.status = GameStatus.PendingSecondPlayer;
    game.pairCreatedDate = new Date().toISOString();

    return game;
  }
}
