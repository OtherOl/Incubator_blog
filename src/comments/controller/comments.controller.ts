import { Body, Controller, Delete, Get, HttpCode, Param, Put, Req, UseGuards } from '@nestjs/common';
import { CommentsQueryRepository } from '../repositories/comments.query-repository';
import { SendLikes } from '../../common/types/likes.model';
import { Request } from 'express';
import { AuthService } from '../../auth/application/auth.service';
import { SkipThrottle } from '@nestjs/throttler';
import { AccessTokenGuard } from '../../auth/guards/accessToken.guard';
import { createCommentModel } from '../../common/types/comments.model';
import { UpdateCommentUseCase } from '../use-cases/updateComment.use-case';
import { DoLikesUseCase } from '../use-cases/doLikes.use-case';
import { DeleteCommentUseCase } from '../use-cases/deleteComment.use-case';

@Controller('comments')
export class CommentsController {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private authService: AuthService,
    private updateCommentUseCase: UpdateCommentUseCase,
    private doLikesUseCase: DoLikesUseCase,
    private deleteCommentUseCase: DeleteCommentUseCase,
  ) {}

  @SkipThrottle()
  @Get(':id')
  @HttpCode(200)
  async getCommentById(@Param('id') id: string, @Req() request: Request) {
    const accessToken = request.headers.authorization;
    const userId = await this.authService.getUserIdForGet(accessToken?.split(' ')[1]);
    return await this.commentsQueryRepository.getCommentByIdService(id, userId);
  }

  @SkipThrottle()
  @UseGuards(AccessTokenGuard)
  @Put(':commentId')
  @HttpCode(204)
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() content: createCommentModel,
    @Req() request: Request,
  ) {
    const accessToken = request.headers.authorization;
    const userId = await this.authService.getUserIdByToken(accessToken?.split(' ')[1]);
    return await this.updateCommentUseCase.updateComment(commentId, content.content, userId);
  }

  @SkipThrottle()
  @UseGuards(AccessTokenGuard)
  @Put(':commentId/like-status')
  @HttpCode(204)
  async doLikeDislike(
    @Param('commentId') commentId: string,
    @Body() likeStatus: SendLikes,
    @Req() request: Request,
  ) {
    const accessToken = request.headers.authorization;
    const userId = await this.authService.getUserIdByToken(accessToken?.split(' ')[1]);
    const comment = await this.commentsQueryRepository.getCommentById(commentId);
    return await this.doLikesUseCase.doLikes(userId, comment, likeStatus.likeStatus);
  }

  @SkipThrottle()
  @UseGuards(AccessTokenGuard)
  @Delete(':commentId')
  @HttpCode(204)
  async deleteComment(@Param('commentId') commentId: string, @Req() request: Request) {
    const accessToken = request.headers.authorization;
    const userId = await this.authService.getUserIdByToken(accessToken?.split(' ')[1]);
    return await this.deleteCommentUseCase.deleteComment(commentId, userId);
  }
}
