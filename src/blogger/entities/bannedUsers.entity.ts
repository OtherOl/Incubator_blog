import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BanUserInfo } from '../../users/entities/users.entity';

@Entity()
export class BannedUsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  login: string;

  @Column({ type: 'jsonb' })
  banInfo: BanUserInfo;

  @Column()
  blogId: string;

  @Column()
  createdAt: string;

  static createBannedUser(userId: string, login: string, blogId: string) {
    const bannedUser = new BannedUsersEntity();

    bannedUser.userId = userId;
    bannedUser.login = login;
    bannedUser.banInfo = {
      isBanned: false,
      banDate: null,
      banReason: null,
    };
    bannedUser.blogId = blogId;
    bannedUser.createdAt = new Date().toISOString();

    return bannedUser;
  }
}
