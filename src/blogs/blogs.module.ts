import { Module } from '@nestjs/common';
import { BlogsController } from './controller/blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blogs.entity';
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
import { Post } from '../posts/entities/posts.entity';
import { Comment } from '../comments/entites/comments.entity';
import { LikesQueryRepository } from '../likes/repositories/likes.query-repository';
import { Likes } from '../likes/entities/likes.entity';
import { SuperAdminBlogsController } from './controller/super-admin.blogs.controller';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { BasicStrategy } from '../auth/strategies/basic.strategy';
import { UsersQueryRepository } from '../users/repositories/users.query-repository';
import { User } from '../users/entities/users.entity';
import { UpdateBlogOwnerUseCase } from './use-cases/updateBlogOwner.use-case';
import { IsBannedForPostUseCase } from '../posts/use-cases/isBannedForPost.use-case';
import { BanUnbanBlogUseCase } from './use-cases/ban-unban-blog.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, Post, Comment, Likes, User])],
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
    UpdateBlogOwnerUseCase,
    UsersQueryRepository,
    BasicAuthGuard,
    BasicStrategy,
    IsBannedForPostUseCase,
    BanUnbanBlogUseCase,
  ],
})
export class BlogsModule {}
