import { Module } from '@nestjs/common';
import { BlogsController } from './controller/blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './domain/blogs.entity';
import { BlogsQueryRepository } from './repositories/blogs.query-repository';
import { BlogsRepository } from './repositories/blogs.repository';
import { CreateBlogUseCase } from './use-cases/createBlog.use-case';
import { CreatePostForBlogUseCase } from './use-cases/createPostForBlog.use-case';
import { DeleteBlogUseCase } from './use-cases/deleteBlog.use-case';
import { DeletePostByBlogIdUseCase } from './use-cases/deletePostByBlogIdUseCase';
import { UpdateBlogUseCase } from './use-cases/updateBlog.use-case';
import { UpdatePostByBlogIdUseCase } from './use-cases/updatePostByBlogId.use-case';
import { AuthService } from '../auth/application/auth.service';
import { PostsQueryRepository } from '../posts/repositories/posts.query-repository';
import { PostsRepository } from '../posts/repositories/posts.repository';
import { Post } from '../posts/domain/posts.entity';
import { Comment } from '../comments/domain/comments.entity';
import { LikesQueryRepository } from '../likes/repositories/likes.query-repository';
import { Likes } from '../likes/domain/likes.entity';
import { SuperAdminBlogsController } from './controller/super-admin.blogs.controller';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { BasicStrategy } from '../auth/strategies/basic.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, Post, Comment, Likes])],
  controllers: [BlogsController, SuperAdminBlogsController],
  providers: [
    BlogsQueryRepository,
    BlogsRepository,
    CreateBlogUseCase,
    CreatePostForBlogUseCase,
    DeleteBlogUseCase,
    DeletePostByBlogIdUseCase,
    UpdateBlogUseCase,
    UpdatePostByBlogIdUseCase,
    AuthService,
    PostsQueryRepository,
    PostsRepository,
    LikesQueryRepository,
    BasicAuthGuard,
    BasicStrategy,
  ],
})
export class BlogsModule {}
