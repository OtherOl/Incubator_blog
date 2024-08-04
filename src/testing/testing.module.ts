import { Module } from '@nestjs/common';
import { TestingController } from './controller/testing.controller';
import { TestingRepository } from './repositories/testing.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthBlackList } from '../auth/domain/auth-black_list.entity';
import { AuthWhiteList } from '../auth/domain/auth-white_list.entity';
import { Blog } from '../blogs/domain/blogs.entity';
import { User } from '../users/domain/users.entity';
import { Security } from '../security-devices/domain/security.entity';
import { Post } from '../posts/domain/posts.entity';
import { Likes } from '../likes/domain/likes.entity';
import { Comment } from '../comments/domain/comments.entity';
import { PlayerEntity } from '../game/pairQuizGame/domain/player.entity';
import { PairQuizGame } from '../game/pairQuizGame/domain/pairQuizGame.entity';
import { QuizQuestions } from '../game/quizQuestions/domain/quizQuestions.entity';
import { Answer } from '../game/pairQuizGame/domain/answers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthBlackList,
      AuthWhiteList,
      Blog,
      User,
      Security,
      Post,
      Likes,
      Comment,
      PlayerEntity,
      PairQuizGame,
      QuizQuestions,
      Answer,
    ]),
  ],
  controllers: [TestingController],
  providers: [TestingRepository],
})
export class TestingModule {}
