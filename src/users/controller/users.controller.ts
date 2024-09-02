import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UsersQueryRepository } from '../repositories/users.query-repository';
import { createUserModel } from '../../common/types/users.model';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { CreateUserUseCase } from '../use-cases/createUser.use-case';
import { DeleteUserUseCase } from '../use-cases/deleteUser.use-case';

@Controller('sa/users')
export class UsersController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private createUserUseCase: CreateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Get()
  @HttpCode(200)
  async getAllUsers(
    @Query()
    query: {
      sortBy: string;
      sortDirection: string;
      pageNumber: number;
      pageSize: number;
      searchLoginTerm: string;
      searchEmailTerm: string;
    },
  ) {
    return await this.usersQueryRepository.getAllUsers(
      query.sortBy,
      query.sortDirection,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
      query.searchLoginTerm || '',
      query.searchEmailTerm || '',
    );
  }

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(201)
  async createUser(@Body() inputData: createUserModel) {
    return await this.createUserUseCase.createUser(inputData);
  }

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    return await this.deleteUserUseCase.deleteUser(id);
  }
}
