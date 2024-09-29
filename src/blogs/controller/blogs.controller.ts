import { Controller, Get, HttpCode, NotFoundException, Param, Query, Req } from '@nestjs/common';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';
import { PostsQueryRepository } from '../../posts/repositories/posts.query-repository';
import { SkipThrottle } from '@nestjs/throttler';
import { Request } from 'express';
import { AuthService } from '../../auth/application/auth.service';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly authService: AuthService,
  ) {}

  @SkipThrottle()
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
    );
  }

  @SkipThrottle()
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
  @Get(':id')
  @HttpCode(200)
  async getBlogById(@Param('id') id: string) {
    const blog = await this.blogsQueryRepository.getBlogById(id);
    if (!blog) throw new NotFoundException("Blog doesn't exists");
    const isBanned = await this.blogsQueryRepository.getFullBlogInfo(id);
    if (isBanned!.banInfo.isBanned) throw new NotFoundException();

    return blog;
  }
}
