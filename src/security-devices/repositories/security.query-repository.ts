import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Security } from '../domain/security.entity';

@Injectable()
export class SecurityQueryRepository {
  constructor(@InjectRepository(Security) private securityRepository: Repository<Security>) {}

  async getAllSessions(userId: string): Promise<Security[]> {
    return await this.securityRepository
      .createQueryBuilder('s')
      .select(['s.ip', 's.title', 's.lastActiveDate', 's.deviceId'])
      .where('s.userId = :userId', { userId })
      .getMany();
  }

  async getSessionById(deviceId: string): Promise<Security> {
    const session = await this.securityRepository
      .createQueryBuilder('s')
      .select()
      .where('s.deviceId = :deviceId', { deviceId })
      .getOne();
    if (!session) {
      throw new NotFoundException("Session doesn't exists");
    } else {
      return session;
    }
  }
}
