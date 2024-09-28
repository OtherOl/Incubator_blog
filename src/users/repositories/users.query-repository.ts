import { Injectable } from '@nestjs/common';
import { ConfirmationCode, userModel } from '../../common/types/users.model';
import { paginationModel } from '../../common/types/pagination.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../entities/users.entity';
import { sortDirectionHelper } from '../../common/helpers/sortDirection.helper';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  async getAllUsers(
    sortBy: string = 'createdAt',
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
    searchLoginTerm: string,
    searchEmailTerm: string,
    banStatus: 'all' | 'banned' | 'notBanned' = 'all',
  ): Promise<paginationModel<userModel>> {
    let countUsers: number;
    const sortDir = sortDirectionHelper(sortDirection);
    const queryCountUsers: SelectQueryBuilder<User> = await this.usersRepository.createQueryBuilder('u');

    if (banStatus === 'all') {
      countUsers = await queryCountUsers
        .where('u.login ilike :login', { login: `%${searchLoginTerm}%` })
        .orWhere('u.email ilike :email', { email: `%${searchEmailTerm}%` })
        .getCount();
    } else if (banStatus === 'banned') {
      countUsers = await queryCountUsers
        .where(`u.banInfo ->> 'isBanned' = :isBanned`, { isBanned: true })
        .andWhere(
          new Brackets((qb) => {
            qb.where('u.login ilike :login', { login: `%${searchLoginTerm}%` }).orWhere(
              'u.email ilike :email',
              { email: `%${searchEmailTerm}%` },
            );
          }),
        )
        .getCount();
    } else {
      countUsers = await queryCountUsers
        .where(`u.banInfo ->> 'isBanned' = :isBanned`, { isBanned: false })
        .andWhere(
          new Brackets((qb) => {
            qb.where('u.login ilike :login', { login: `%${searchLoginTerm}%` }).orWhere(
              'u.email ilike :email',
              { email: `%${searchEmailTerm}%` },
            );
          }),
        )
        .getCount();
    }

    let foundUsers: User[];
    const queryFoundUsers: SelectQueryBuilder<User> = await this.usersRepository
      .createQueryBuilder('u')
      .select(['u.id', 'u.login', 'u.email', 'u.createdAt', 'u.banInfo']);

    if (banStatus === 'all') {
      foundUsers = await queryFoundUsers
        .where('u.login ilike :login', { login: `%${searchLoginTerm}%` })
        .orWhere('u.email ilike :email', { email: `%${searchEmailTerm}%` })
        .orderBy(`u.${sortBy}`, sortDir)
        .limit(pageSize)
        .offset((pageNumber - 1) * pageSize)
        .getMany();
    } else if (banStatus === 'banned') {
      foundUsers = await queryFoundUsers
        .where(`u.banInfo ->> 'isBanned' = :isBanned`, { isBanned: true })
        .andWhere(
          new Brackets((qb) => {
            qb.where('u.login ilike :login', { login: `%${searchLoginTerm}%` }).orWhere(
              'u.email ilike :email',
              { email: `%${searchEmailTerm}%` },
            );
          }),
        )
        .orderBy(`u.${sortBy}`, sortDir)
        .limit(pageSize)
        .offset((pageNumber - 1) * pageSize)
        .getMany();
    } else {
      foundUsers = await queryFoundUsers
        .where(`u.banInfo ->> 'isBanned' = :isBanned`, { isBanned: false })
        .andWhere(
          new Brackets((qb) => {
            qb.where('u.login ilike :login', { login: `%${searchLoginTerm}%` }).orWhere(
              'u.email ilike :email',
              { email: `%${searchEmailTerm}%` },
            );
          }),
        )
        .orderBy(`u.${sortBy}`, sortDir)
        .limit(pageSize)
        .offset((pageNumber - 1) * pageSize)
        .getMany();
    }

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

  async getFullUserInfoById(id: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ id });
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
        'u.banInfo',
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
