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
  Req,
  UseGuards,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';
import { createBlogModel } from '../../common/types/blogs.model';
import { PostsQueryRepository } from '../../posts/repositories/posts.query-repository';
import { createBlogPostModel } from '../../common/types/posts.model';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { CreateBlogUseCase } from '../use-cases/createBlog.use-case';
import { CreatePostForBlogUseCase } from '../use-cases/createPostForBlog.use-case';
import { UpdateBlogUseCase } from '../use-cases/updateBlog.use-case';
import { DeleteBlogUseCase } from '../use-cases/deleteBlog.use-case';
import { UpdatePostByBlogIdUseCase } from '../use-cases/updatePostByBlogId.use-case';
import { DeletePostByBlogIdUseCase } from '../use-cases/deletePostByBlogIdUseCase';
import { Request } from 'express';
import { AuthService } from '../../auth/application/auth.service';
import { UpdateBlogOwnerUseCase } from '../use-cases/updateBlogOwner.use-case';

@Controller('sa/blogs')
export class SuperAdminBlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly authService: AuthService,
    private readonly createBlogUseCase: CreateBlogUseCase,
    private readonly createPostForBlogUseCase: CreatePostForBlogUseCase,
    private readonly updateBlogUseCase: UpdateBlogUseCase,
    private readonly deleteBlogUseCase: DeleteBlogUseCase,
    private readonly updatePostByBlogIdUseCase: UpdatePostByBlogIdUseCase,
    private readonly deletePostByBlogIdUseCase: DeletePostByBlogIdUseCase,
    private readonly updateBlogOwnerUseCase: UpdateBlogOwnerUseCase,
  ) {}

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Get()
  @HttpCode(200)
  async getAllBlogs(
    @Query()
    query: {
      searchNameTerm: string;
      sortBy: string;
      sortDirection: string;
      pageNumber: number;
      pageSize: number;
    },
  ) {
    return await this.blogsQueryRepository.getAllBlogs(
      query.searchNameTerm || '',
      query.sortBy,
      query.sortDirection,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
      'admin',
    );
  }

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Put(':id/bind-with-user/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlogOwnerInfo(@Param('id') id: string, @Param('userId') userId: string) {
    return await this.updateBlogOwnerUseCase.update(id, userId);
  }

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(201)
  async createBlog(@Body() inputData: createBlogModel) {
    return await this.createBlogUseCase.createBlog(inputData);
  }

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updateBlog(@Param('id') id: string, @Body() inputData: createBlogModel) {
    return await this.updateBlogUseCase.updateBlog(id, inputData);
  }

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteBlogById(@Param('id') blogId: string) {
    return await this.deleteBlogUseCase.deleteBlogById(blogId);
  }

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Get(':blogId/posts')
  @HttpCode(200)
  async getPostsByBlogId(
    @Param('blogId') blogId: string,
    @Query()
    query: {
      searchNameTerm: string;
      sortBy: string;
      sortDirection: string;
      pageNumber: number;
      pageSize: number;
    },
    @Req() request: Request,
  ) {
    const accessToken = request.headers.authorization;
    const userId = await this.authService.getUserIdForGet(accessToken?.split(' ')[1]);
    return await this.postsQueryRepository.getAllPostsByBlogId(
      blogId,
      query.sortBy,
      query.sortDirection,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
      userId,
    );
  }

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Post(':blogId/posts')
  @HttpCode(201)
  async createPostForBlog(@Param('blogId') blogId: string, @Body() inputData: createBlogPostModel) {
    return await this.createPostForBlogUseCase.createPostForBlog(blogId, inputData);
  }

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Put(':blogId/posts/:postId')
  @HttpCode(204)
  async updatePostByBlogId(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() inputData: createBlogPostModel,
  ) {
    return await this.updatePostByBlogIdUseCase.updatePost(blogId, postId, inputData);
  }

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Delete(':blogId/posts/:postId')
  @HttpCode(204)
  async deletePostByBlogId(@Param('blogId') blogId: string, @Param('postId') postId: string) {
    return await this.deletePostByBlogIdUseCase.deletePost(blogId, postId);
  }
}
