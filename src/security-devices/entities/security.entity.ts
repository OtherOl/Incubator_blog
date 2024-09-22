import { v4 as uuidv4 } from 'uuid';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../users/entities/users.entity';

@Entity({ name: 'Security' })
export class Security {
  @PrimaryColumn()
  id: string;

  @Column()
  ip: string;

  @Column()
  title: string;

  @Column()
  lastActiveDate: string;

  @Column()
  deviceId: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (u) => u.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  static createSession(ip: string, title: string = 'Chrome 105', verifiedToken: any) {
    const session = new Security();

    session.id = uuidv4();
    session.ip = ip;
    session.title = title;
    session.lastActiveDate = new Date(verifiedToken.iat * 1000).toISOString();
    session.deviceId = verifiedToken.deviceId;
    session.userId = verifiedToken.userId;

    return session;
  }
}
