import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersQueryRepository } from '../repositories/users.query-repository';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersRepository: UsersRepository,
  ) {}

  async deleteUser(id: string) {
    const user = await this.usersQueryRepository.getUserById(id);
    if (!user) throw new NotFoundException("User doesn't exists");
    return await this.usersRepository.deleteUser(id);
  }
}
