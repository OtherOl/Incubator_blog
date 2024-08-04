import { Injectable } from '@nestjs/common';
import { ConfirmationCode, userModel } from '../../base/types/users.model';
import { paginationModel } from '../../base/types/pagination.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/users.entity';
import { sortDirectionHelper } from '../../base/helpers/sortDirection.helper';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async getAllUsers(
    sortBy: string = 'createdAt',
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
    searchLoginTerm: string,
    searchEmailTerm: string,
  ): Promise<paginationModel<userModel>> {
    const sortDir = sortDirectionHelper(sortDirection);
    const countUsers = await this.usersRepository
      .createQueryBuilder('u')
      .where('u.login ilike :login', { login: `%${searchLoginTerm}%` })
      .orWhere('u.email ilike :email', { email: `%${searchEmailTerm}%` })
      .getCount();

    const foundUsers = await this.usersRepository
      .createQueryBuilder('u')
      .select(['u.id', 'u.login', 'u.email', 'u.createdAt'])
      .where('u.login ilike :login', { login: `%${searchLoginTerm}%` })
      .orWhere('u.email ilike :email', { email: `%${searchEmailTerm}%` })
      .orderBy(`u.${sortBy}`, sortDir)
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .getMany();

    return {
      pagesCount: Math.ceil(countUsers / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: countUsers,
      items: foundUsers,
    };
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.usersRepository
      .createQueryBuilder('u')
      .select([`u.id`, 'u.login', 'u.email', `u.createdAt`])
      .where('u.id = :id', { id })
      .getOne();
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
    return await this.usersRepository
      .createQueryBuilder('u')
      .select([
        `u.id`,
        'u.login',
        'u.email',
        `u.createdAt`,
        'u.isConfirmed',
        'u.passwordHash',
        'u.recoveryConfirmation',
      ])
      .where('u.login = :login', { login: loginOrEmail })
      .orWhere('u.email = :email', { email: loginOrEmail })
      .getOne();
  }

  async findUserByConfirmationCode(code: ConfirmationCode): Promise<userModel | null> {
    return await this.usersRepository
      .createQueryBuilder('u')
      .where(`u.emailConfirmation ->>'confirmationCode' = :code`, { code: code.code })
      .getOne();
  }

  async findUserByRecoveryCode(recoveryCode: string): Promise<userModel | null> {
    return await this.usersRepository
      .createQueryBuilder('u')
      .where(`u.recoveryConfirmation ->>'recoveryCode' = :code`, { code: recoveryCode })
      .getOne();
  }
}
