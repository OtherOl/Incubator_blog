import { Module } from '@nestjs/common';
import { AuthService } from '../auth/application/auth.service';
import { BlogsQueryRepository } from '../blogs/repositories/blogs.query-repository';
import { PostsQueryRepository } from '../posts/repositories/posts.query-repository';
import { CreateBlogUseCase } from '../blogs/use-cases/createBlog.use-case';
import { UpdateBlogUseCase } from '../blogs/use-cases/updateBlog.use-case';
import { DeleteBlogUseCase } from '../blogs/use-cases/deleteBlog.use-case';
import { CreatePostForBlogUseCase } from '../blogs/use-cases/createPostForBlog.use-case';
import { UpdatePostByBlogIdUseCase } from '../blogs/use-cases/updatePostByBlogId.use-case';
import { DeletePostByBlogIdUseCase } from '../blogs/use-cases/deletePostByBlogIdUseCase';
import { BloggerBlogsController } from './controllers/blogger-blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from '../blogs/entities/blogs.entity';
import { Post } from '../posts/entities/posts.entity';
import { Comment } from '../comments/entites/comments.entity';
import { Likes } from '../likes/entities/likes.entity';
import { BlogsRepository } from '../blogs/repositories/blogs.repository';
import { PostsRepository } from '../posts/repositories/posts.repository';
import { LikesQueryRepository } from '../likes/repositories/likes.query-repository';
import { User } from '../users/entities/users.entity';
import { UsersQueryRepository } from '../users/repositories/users.query-repository';
import { IsBannedForPostUseCase } from '../posts/use-cases/isBannedForPost.use-case';
import { BanUnbanUserUseCase } from './use-cases/ban-unban-user.use-case';
import { UsersRepository } from '../users/repositories/users.repository';
import { BannedUsersEntity } from './entities/bannedUsers.entity';
import { BannedUsersRepository } from './repositories/bannedUsers.repository';
import { BannedUsersQueryRepository } from './repositories/bannedUsers.query-repository';
import { BloggerUsersController } from './controllers/blogger-users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, Post, Comment, Likes, User, BannedUsersEntity])],
  controllers: [BloggerBlogsController, BloggerUsersController],
  providers: [
    AuthService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsRepository,
    PostsQueryRepository,
    LikesQueryRepository,
    UsersQueryRepository,
    UsersRepository,
    CreateBlogUseCase,
    UpdateBlogUseCase,
    DeleteBlogUseCase,
    CreatePostForBlogUseCase,
    UpdatePostByBlogIdUseCase,
    DeletePostByBlogIdUseCase,
    IsBannedForPostUseCase,
    BanUnbanUserUseCase,
    BannedUsersRepository,
    BannedUsersQueryRepository,
  ],
})
export class BloggerModule {}
