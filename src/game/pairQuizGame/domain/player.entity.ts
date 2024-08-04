import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AnswerViewModel, Player, PlayerType } from '../../../base/types/game.model';
import { PairQuizGame } from './pairQuizGame.entity';

@Entity()
export class PlayerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb', { array: true, default: {} })
  answers: AnswerViewModel[];

  @Column({ type: 'jsonb' })
  player: Player;

  @Column({ enum: PlayerType })
  playerType: PlayerType;

  @ManyToOne(() => PairQuizGame, (p) => p.id, { onDelete: 'CASCADE' })
  @Index('gameId')
  @JoinColumn({ name: 'gameId' })
  gameId: string;

  @Column()
  score: number;

  @Column({ nullable: true })
  answerFinishDate: string;

  @Column({ default: 0 })
  winsCount: number;

  @Column({ default: 0 })
  lossesCount: number;

  @Column({ default: 0 })
  drawsCount: number;

  @Column({ default: 0 })
  gamesCount: number;

  static createPlayer(userId: string, login: string, gameId: string, playerType: PlayerType) {
    const player = new PlayerEntity();

    player.player = {
      id: userId,
      login: login,
    };
    player.playerType = playerType;
    player.gameId = gameId;
    player.score = 0;

    return player;
  }
}
