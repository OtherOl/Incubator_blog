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
import { AccessTokenGuard } from '../../auth/guards/accessToken.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { createBlogModel } from '../../common/types/blogs.model';
import { createBlogPostModel } from '../../common/types/posts.model';
import { CreateBlogUseCase } from '../../blogs/use-cases/createBlog.use-case';
import { Request } from 'express';
import { BlogsQueryRepository } from '../../blogs/repositories/blogs.query-repository';
import { AuthService } from '../../auth/application/auth.service';
import { UpdateBlogUseCase } from '../../blogs/use-cases/updateBlog.use-case';
import { DeleteBlogUseCase } from '../../blogs/use-cases/deleteBlog.use-case';
import { CreatePostForBlogUseCase } from '../../blogs/use-cases/createPostForBlog.use-case';
import { PostsQueryRepository } from '../../posts/repositories/posts.query-repository';
import { UpdatePostByBlogIdUseCase } from '../../blogs/use-cases/updatePostByBlogId.use-case';
import { DeletePostByBlogIdUseCase } from '../../blogs/use-cases/deletePostByBlogIdUseCase';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';
import { CommentsQueryRepository } from '../../comments/repositories/comments.query-repository';
import { sortDirectionHelper } from '../../common/helpers/sortDirection.helper';

@Controller('blogger/blogs')
export class BloggerBlogsController {
  constructor(
    private readonly blogsQueryRepo: BlogsQueryRepository,
    private readonly usersQueryRepo: UsersQueryRepository,
    private readonly createBlogUseCase: CreateBlogUseCase,
    private readonly authService: AuthService,
    private readonly updateBlogUseCase: UpdateBlogUseCase,
    private readonly deleteBlogUseCase: DeleteBlogUseCase,
    private readonly createPostForBlogUseCase: CreatePostForBlogUseCase,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly updatePostByBlogIdUseCase: UpdatePostByBlogIdUseCase,
    private readonly deletePostByBlogIdUseCase: DeletePostByBlogIdUseCase,
    private readonly commentsQueryRepo: CommentsQueryRepository,
  ) {}

  @SkipThrottle()
  @Get('comments')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async getAllComments(
    @Req() req: Request,
    @Query()
    query: {
      pageNumber: number;
      pageSize: number;
      sortBy: string;
      sortDirection: string;
    },
  ) {
    const userId: string = await this.authService.getUserIdByToken(req.headers.authorization!.split(' ')[1]);
    const sortDir = sortDirectionHelper(query.sortDirection);
    return await this.commentsQueryRepo.getAllComments(
      userId,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
      query.sortBy,
      sortDir,
    );
  }

  @SkipThrottle()
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async getAllBlogs(
    @Req() req: Request,
    @Query()
    query: {
      searchNameTerm: string;
      sortBy: string;
      sortDirection: string;
      pageNumber: number;
      pageSize: number;
    },
  ) {
    const userId: string = await this.authService.getUserIdForGet(req.headers.authorization!.split(' ')[1]);
    return await this.blogsQueryRepo.getAllBlogs(
      query.searchNameTerm || '',
      query.sortBy,
      query.sortDirection,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
      userId,
    );
  }

  @SkipThrottle()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AccessTokenGuard)
  async createBlog(@Body() inputData: createBlogModel, @Req() req: Request) {
    const userId = await this.authService.getUserIdForGet(req.headers.authorization!.split(' ')[1]);
    const user = await this.usersQueryRepo.getUserById(userId);
    return await this.createBlogUseCase.createBlog(inputData, userId, user!.login!);
  }

  @SkipThrottle()
  @Put(':blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AccessTokenGuard)
  async updateBlog(@Req() req: Request, @Param('blogId') blogId: string, @Body() inputData: createBlogModel) {
    const userId = await this.authService.getUserIdForGet(req.headers.authorization!.split(' ')[1]);
    return await this.updateBlogUseCase.updateBlog(blogId, inputData, userId);
  }

  @SkipThrottle()
  @Delete(':blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AccessTokenGuard)
  async deleteBlog(@Req() req: Request, @Param('blogId') blogId: string) {
    const userId = await this.authService.getUserIdForGet(req.headers.authorization!.split(' ')[1]);
    return await this.deleteBlogUseCase.deleteBlogById(blogId, userId);
  }

  @SkipThrottle()
  @Get(':blogId/posts')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async getAllPostsByBlogId(
    @Req() req: Request,
    @Param('blogId') blogId: string,
    @Query()
    query: {
      pageNumber: number;
      pageSize: number;
      sortBy: string;
      sortDirection: string;
    },
  ) {
    const userId = await this.authService.getUserIdForGet(req.headers.authorization!.split(' ')[1]);
    return await this.postsQueryRepository.getAllPostsByBlogId(
      blogId,
      query.sortBy,
      query.sortDirection,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
      userId,
      true,
    );
  }

  @SkipThrottle()
  @Post(':blogId/posts')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AccessTokenGuard)
  async createPostByBlogId(
    @Req() req: Request,
    @Param('blogId') blogId: string,
    @Body() inputData: createBlogPostModel,
  ) {
    const userId = await this.authService.getUserIdForGet(req.headers.authorization!.split(' ')[1]);
    return await this.createPostForBlogUseCase.createPostForBlog(blogId, inputData, userId);
  }

  @SkipThrottle()
  @Put(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AccessTokenGuard)
  async updatePostByBlogId(
    @Req() req: Request,
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() inputData: createBlogPostModel,
  ) {
    const userId = await this.authService.getUserIdForGet(req.headers.authorization!.split(' ')[1]);
    return await this.updatePostByBlogIdUseCase.updatePost(blogId, postId, inputData, userId);
  }

  @SkipThrottle()
  @Delete(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AccessTokenGuard)
  async deletePostByBlogId(
    @Req() req: Request,
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
  ) {
    const userId = await this.authService.getUserIdForGet(req.headers.authorization!.split(' ')[1]);
    return await this.deletePostByBlogIdUseCase.deletePost(blogId, postId, userId);
  }
}
