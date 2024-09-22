import { Injectable } from '@nestjs/common';
import { userModel } from '../../common/types/users.model';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { add } from 'date-fns/add';
import { User } from '../entities/users.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async createUser(newUser: userModel) {
    await this.usersRepository.insert(newUser);

    return {
      id: newUser.id,
      login: newUser.login,
      email: newUser.email,
      createdAt: newUser.createdAt,
      banInfo: {
        isBanned: newUser.banInfo.isBanned,
        banDate: newUser.banInfo.banDate,
        banReason: newUser.banInfo.banReason,
      },
    };
  }

  async deleteUser(id: string): Promise<DeleteResult> {
    return await this.usersRepository.delete({ id });
  }

  async updateConfirmation(userId: string): Promise<UpdateResult> {
    return await this.usersRepository.update({ id: userId }, { isConfirmed: true });
  }

  async changeConfirmationCode(userId: string, code: string): Promise<UpdateResult> {
    const newExpDate = add(new Date(), { minutes: 3 }).toISOString();
    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({
        emailConfirmation: () => `jsonb_set("emailConfirmation", '{confirmationCode}', '"${code}"')`,
      })
      .where('id = :id', { id: userId })
      .execute();

    return await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({
        emailConfirmation: () => `jsonb_set("emailConfirmation", '{expirationDate}', '"${newExpDate}"')`,
      })
      .where(`id = :id`, { id: userId })
      .execute();
  }

  async updatePassword(userId: string, passwordHash: string): Promise<UpdateResult> {
    return await this.usersRepository.update({ id: userId }, { passwordHash });
  }

  async banUnbanUser(userId: string, isBanned: boolean, banReason: string) {
    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ banInfo: () => `jsonb_set("banInfo", '{isBanned}', '${isBanned}')` })
      .where('id = :userId', { userId })
      .execute();

    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({
        banInfo: () =>
          `jsonb_set("banInfo", '{banDate}', '${isBanned ? `"${new Date().toISOString()}"` : null}')`,
      })
      .where('id = :userId', { userId })
      .execute();

    return await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ banInfo: () => `jsonb_set("banInfo", '{banReason}', '${isBanned ? `"${banReason}"` : null}')` })
      .where('id = :userId', { userId })
      .execute();
  }
}
