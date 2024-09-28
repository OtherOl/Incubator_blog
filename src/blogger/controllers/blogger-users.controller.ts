import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AccessTokenGuard } from '../../auth/guards/accessToken.guard';
import { BanUserInputBloggerModel } from '../../common/types/users.model';
import { BanUnbanUserUseCase } from '../use-cases/ban-unban-user.use-case';
import { AuthService } from '../../auth/application/auth.service';
import { Request } from 'express';
import { BannedUsersQueryRepository } from '../repositories/bannedUsers.query-repository';

@Controller('blogger/users')
export class BloggerUsersController {
  constructor(
    private readonly banUnbanUserUseCase: BanUnbanUserUseCase,
    private readonly authService: AuthService,
    private readonly bannedUsersQueryRepo: BannedUsersQueryRepository,
  ) {}

  @SkipThrottle()
  @Put(':id/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AccessTokenGuard)
  async banUnbanUser(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() inputData: BanUserInputBloggerModel,
  ) {
    const blogOwnerId: string = await this.authService.getUserIdByToken(
      req.headers.authorization!.split(' ')[1],
    );
    return await this.banUnbanUserUseCase.banUnbanUser(
      blogOwnerId,
      id,
      inputData.blogId,
      inputData.isBanned,
      inputData.banReason,
    );
  }

  @SkipThrottle()
  @Get('blog/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async getBannedUsers(
    @Param('id') id: string,
    @Query()
    query: {
      searchLoginTerm: string;
      sortBy: string;
      sortDirection: string;
      pageNumber: number;
      pageSize: number;
    },
  ) {
    return await this.bannedUsersQueryRepo.getAllBannedUsers(
      id,
      query.searchLoginTerm || '',
      query.sortBy,
      query.sortDirection,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
    );
  }
}
