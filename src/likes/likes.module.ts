import { Module } from '@nestjs/common';
import { LikesService } from './application/likes.service';
import { LikesQueryRepository } from './repositories/likes.query-repository';
import { LikesRepository } from './repositories/likes.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Likes } from './domain/likes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Likes])],
  controllers: [],
  providers: [LikesService, LikesQueryRepository, LikesRepository],
})
export class LikesModule {}
