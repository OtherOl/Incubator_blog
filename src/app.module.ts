import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SecurityDevicesModule } from './security-devices/security-devices.module';
import { LikesModule } from './likes/likes.module';
import { PostsModule } from './posts/posts.module';
import { BlogsModule } from './blogs/blogs.module';
import { CommentsModule } from './comments/comments.module';
import { TestingModule } from './testing/testing.module';
import { PairQuizGameModule } from './game/pairQuizGame/pair-quiz-game.module';
import { QuizQuestionsModule } from './game/quizQuestions/quiz-questions.module';
import { BloggerModule } from './blogger/blogger.module';

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: PGHOST,
      port: 5432,
      username: PGUSER,
      password: PGPASSWORD,
      database: PGDATABASE,
      autoLoadEntities: true,
      synchronize: true,
      ssl: true,
      // logging: ['query'],
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: 'dmitrybackenddev@gmail.com',
          pass: 'tzcjafbdsjqrpmwl',
        },
        service: 'gmail',
      },
    }),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET || '123',
    }),
    ThrottlerModule.forRoot([{ ttl: 10000, limit: 6 }]),
    AuthModule,
    UsersModule,
    SecurityDevicesModule,
    LikesModule,
    PostsModule,
    BlogsModule,
    CommentsModule,
    TestingModule,
    PairQuizGameModule,
    QuizQuestionsModule,
    BloggerModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
