import { Injectable } from '@nestjs/common';
import { AuthBlackListRepository } from './auth-black-list-repository.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { AuthWhiteList } from '../entities/auth-white_list.entity';

@Injectable()
export class AuthWhiteListRepository {
  constructor(
    @InjectRepository(AuthWhiteList)
    private authWhiteListRepository: Repository<AuthWhiteList>,
    private authBlackListRepository: AuthBlackListRepository,
  ) {}

  async createNewToken(token: string, userId: string, deviceId: string) {
    return await this.authWhiteListRepository.insert({ token, userId, deviceId });
  }

  async deleteToken(token: string): Promise<DeleteResult> {
    return await this.authWhiteListRepository.delete({ token });
  }

  async deleteTokenByDeviceId(deviceId: string): Promise<DeleteResult> {
    const refreshToken = await this.authWhiteListRepository.findOneBy({ deviceId });
    await this.authBlackListRepository.blackList(refreshToken!.token);
    return await this.authWhiteListRepository.delete({ deviceId });
  }

  async deleteAllExceptOne(userId: string, deviceId: string): Promise<DeleteResult> {
    return await this.authWhiteListRepository
      .createQueryBuilder()
      .delete()
      .from(AuthWhiteList)
      .where('userId = :userId', { userId })
      .andWhere('deviceId != :deviceId', { deviceId })
      .execute();
  }

  async findTokens(userId: string, deviceId: string): Promise<AuthWhiteList[] | null> {
    return await this.authWhiteListRepository
      .createQueryBuilder('aw')
      .select()
      .where('aw.userId = :userId', { userId })
      .andWhere('aw.deviceId != :deviceId', { deviceId })
      .getMany();
  }

  async deleteAllTokens(userId: string) {
    return await this.authWhiteListRepository.delete({ userId });
  }
}
