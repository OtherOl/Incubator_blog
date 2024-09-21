import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersQueryRepository } from '../repositories/users.query-repository';
import { BanUserInputModel, createUserModel } from '../../common/types/users.model';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { CreateUserUseCase } from '../use-cases/createUser.use-case';
import { DeleteUserUseCase } from '../use-cases/deleteUser.use-case';
import { BanUserUseCase } from '../use-cases/banUser.use-case';

@Controller('sa/users')
export class UsersController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly banUserUseCase: BanUserUseCase,
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
      banStatus: 'all' | 'banned' | 'notBanned';
    },
  ) {
    return await this.usersQueryRepository.getAllUsers(
      query.sortBy,
      query.sortDirection,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
      query.searchLoginTerm || '',
      query.searchEmailTerm || '',
      query.banStatus,
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
  @Put(':id/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(BasicAuthGuard)
  async banUser(@Param('id') id: string, @Body() inputData: BanUserInputModel) {
    return await this.banUserUseCase.ban(id, inputData.isBanned, inputData.banReason);
  }

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    return await this.deleteUserUseCase.deleteUser(id);
  }
}
