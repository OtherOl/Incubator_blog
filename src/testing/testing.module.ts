import { Module } from '@nestjs/common';
import { TestingController } from './controller/testing.controller';
import { TestingRepository } from './repositories/testing.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthBlackList } from '../auth/entities/auth-black_list.entity';
import { AuthWhiteList } from '../auth/entities/auth-white_list.entity';
import { Blog } from '../blogs/entities/blogs.entity';
import { User } from '../users/entities/users.entity';
import { Security } from '../security-devices/entities/security.entity';
import { Post } from '../posts/entities/posts.entity';
import { Likes } from '../likes/entities/likes.entity';
import { Comment } from '../comments/entites/comments.entity';
import { PlayerEntity } from '../game/pairQuizGame/entities/player.entity';
import { PairQuizGame } from '../game/pairQuizGame/entities/pairQuizGame.entity';
import { QuizQuestions } from '../game/quizQuestions/entities/quizQuestions.entity';
import { Answer } from '../game/pairQuizGame/entities/answers.entity';
import { BannedUsersEntity } from '../blogger/entities/bannedUsers.entity';

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
      BannedUsersEntity,
    ]),
  ],
  controllers: [TestingController],
  providers: [TestingRepository],
})
export class TestingModule {}
