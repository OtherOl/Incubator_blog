import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/users.entity';

@Entity({ name: 'AuthWhiteList' })
export class AuthWhiteList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (u) => u.whiteTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  usersId: User;

  @Column()
  deviceId: string;
}
