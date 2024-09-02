import { Injectable } from '@nestjs/common';
import { securityViewModel } from '../../common/types/security.model';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Security } from '../domain/security.entity';

@Injectable()
export class SecurityRepository {
  constructor(@InjectRepository(Security) private securityRepository: Repository<Security>) {}

  async deleteAllSessions(deviceId: string): Promise<DeleteResult> {
    return await this.securityRepository
      .createQueryBuilder()
      .delete()
      .from(Security)
      .where('deviceId != :deviceId', { deviceId })
      .execute();
  }

  async createSession(newSession: securityViewModel): Promise<InsertResult> {
    return await this.securityRepository.insert(newSession);
  }

  async updateSession(deviceId: string): Promise<UpdateResult> {
    return await this.securityRepository.update({ deviceId }, { lastActiveDate: new Date().toISOString() });
  }

  async deleteSpecifiedSession(deviceId: string): Promise<DeleteResult> {
    return await this.securityRepository.delete({ deviceId });
  }
}
