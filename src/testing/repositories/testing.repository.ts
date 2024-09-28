import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthBlackList } from '../../auth/entities/auth-black_list.entity';
import { AuthWhiteList } from '../../auth/entities/auth-white_list.entity';
import { Blog } from '../../blogs/entities/blogs.entity';
import { User } from '../../users/entities/users.entity';
import { Post } from '../../posts/entities/posts.entity';
import { Likes } from '../../likes/entities/likes.entity';
import { Comment } from '../../comments/entites/comments.entity';
import { Security } from '../../security-devices/entities/security.entity';
import { PairQuizGame } from '../../game/pairQuizGame/entities/pairQuizGame.entity';
import { QuizQuestions } from '../../game/quizQuestions/entities/quizQuestions.entity';
import { Answer } from '../../game/pairQuizGame/entities/answers.entity';
import { PlayerEntity } from '../../game/pairQuizGame/entities/player.entity';
import { BannedUsersEntity } from '../../blogger/entities/bannedUsers.entity';

@Injectable()
export class TestingRepository {
  constructor(
    @InjectRepository(AuthBlackList) private readonly authBlackListRepository: Repository<AuthBlackList>,
    @InjectRepository(AuthWhiteList)
    private readonly authWhiteListRepository: Repository<AuthWhiteList>,
    @InjectRepository(Blog) private readonly blogsRepository: Repository<Blog>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Security) private readonly securityRepository: Repository<Security>,
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    @InjectRepository(Likes) private readonly likesRepository: Repository<Likes>,
    @InjectRepository(Comment) private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(PlayerEntity) private readonly playerRepository: Repository<PlayerEntity>,
    @InjectRepository(PairQuizGame) private readonly pairQuizGameRepository: Repository<PairQuizGame>,
    @InjectRepository(QuizQuestions) private readonly quizQuestionsRepository: Repository<QuizQuestions>,
    @InjectRepository(Answer) private readonly answerRepository: Repository<Answer>,
    @InjectRepository(BannedUsersEntity)
    private readonly bannedUsersRepository: Repository<BannedUsersEntity>,
  ) {}

  async clearDB() {
    await this.likesRepository.delete({});
    await this.commentsRepository.delete({});
    await this.postsRepository.delete({});
    await this.blogsRepository.delete({});
    await this.securityRepository.delete({});
    await this.usersRepository.delete({});
    await this.authBlackListRepository.delete({});
    await this.authWhiteListRepository.delete({});
    await this.playerRepository.delete({});
    await this.pairQuizGameRepository.delete({});
    await this.quizQuestionsRepository.delete({});
    await this.answerRepository.delete({});
    await this.bannedUsersRepository.delete({});
    return;
  }
}
