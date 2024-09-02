import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsQueryRepository } from '../repositories/posts.query-repository';
import { createCommentModel } from '../../common/types/comments.model';
import { Request } from 'express';
import { AuthService } from '../../auth/application/auth.service';
import { SendLikes } from '../../common/types/likes.model';
import { SkipThrottle } from '@nestjs/throttler';
import { AccessTokenGuard } from '../../auth/guards/accessToken.guard';
import { CreateCommentUseCase } from '../use-cases/createComment.use-case';
import { DoPostLikesUseCase } from '../use-cases/doPostLikes.use-case';

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private authService: AuthService,
    private createCommentUseCase: CreateCommentUseCase,
    private doPostLikesUseCase: DoPostLikesUseCase,
  ) {}

  @SkipThrottle()
  @Get(':postId/comments')
  @HttpCode(200)
  async getCommentsByPostId(
    @Param('postId') postId: string,
    @Query()
    query: {
      sortBy: string;
      sortDirection: string;
      pageNumber: number;
      pageSize: number;
    },
    @Req() request: Request,
  ) {
    const accessToken = request.headers.authorization;
    const userId = await this.authService.getUserIdForGet(accessToken?.split(' ')[1]);
    return await this.postsQueryRepository.getCommentsByPostId(
      postId,
      query.sortBy,
      query.sortDirection,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
      userId,
    );
  }

  @SkipThrottle()
  @UseGuards(AccessTokenGuard)
  @Post(':postId/comments')
  @HttpCode(201)
  async createCommentForPost(
    @Param('postId') postId: string,
    @Body() inputData: createCommentModel,
    @Req() request: Request,
  ) {
    const accessToken = request.headers.authorization;
    const userId = await this.authService.getUserIdByToken(accessToken?.split(' ')[1]);
    return await this.createCommentUseCase.createComment(postId, inputData, userId);
  }

  @SkipThrottle()
  @Get()
  @HttpCode(200)
  async getAllPosts(
    @Query()
    query: {
      sortBy: string;
      sortDirection: string;
      pageNumber: number;
      pageSize: number;
    },
    @Req() request: Request,
  ) {
    const accessToken = request.headers.authorization;
    const userId = await this.authService.getUserIdForGet(accessToken?.split(' ')[1]);
    return await this.postsQueryRepository.getAllPosts(
      query.sortBy,
      query.sortDirection,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
      userId,
    );
  }

  @SkipThrottle()
  @Get(':id')
  @HttpCode(200)
  async getPostById(@Param('id') id: string, @Req() request: Request) {
    const accessToken = request.headers.authorization;
    const userId = await this.authService.getUserIdForGet(accessToken?.split(' ')[1]);
    return await this.postsQueryRepository.getPostById(id, userId);
  }

  @SkipThrottle()
  @UseGuards(AccessTokenGuard)
  @Put(':postId/like-status')
  @HttpCode(204)
  async doLikeDislike(
    @Param('postId') postId: string,
    @Body() likeStatus: SendLikes,
    @Req() request: Request,
  ) {
    const accessToken = request.headers.authorization;
    const userId = await this.authService.getUserIdByToken(accessToken?.split(' ')[1]);
    const post = await this.postsQueryRepository.getPostByIdSQL(postId);
    if (!post) throw new NotFoundException("Post doesn't exists");
    return await this.doPostLikesUseCase.doLikes(userId, post, likeStatus.likeStatus);
  }
}
