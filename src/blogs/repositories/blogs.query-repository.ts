import { Injectable } from '@nestjs/common';
import { adminBlogViewModel, blogViewModel } from '../../common/types/blogs.model';
import { paginationModel } from '../../common/types/pagination.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Blog } from '../domain/blogs.entity';
import { sortDirectionHelper } from '../../common/helpers/sortDirection.helper';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectRepository(Blog) private blogsRepository: Repository<Blog>) {}

  async getAllBlogs(
    searchNameTerm: string,
    sortBy: string = 'createdAt',
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
    userId?: string,
  ): Promise<paginationModel<blogViewModel>> {
    let countedBlogs: number;
    const sortDir = sortDirectionHelper(sortDirection);
    const queryCountBlogs = await this.blogsRepository
      .createQueryBuilder('b')
      .select()
      .addSelect('b.blogOwnerInFO')
      .where('b.name ilike :name', { name: `%${searchNameTerm}%` });

    if (userId && userId !== 'admin') {
      countedBlogs = await queryCountBlogs
        .andWhere(`b.blogOwnerInfo ->> 'userId' = :userId`, { userId })
        .getCount();
    } else {
      countedBlogs = await queryCountBlogs.getCount();
    }

    let queryFoundedBlogs: SelectQueryBuilder<Blog>;
    if (userId && userId !== 'admin') {
      queryFoundedBlogs = await this.blogsRepository
        .createQueryBuilder('b')
        .select()
        .where('b.name ilike :name', { name: `%${searchNameTerm}%` });
    } else if (userId === 'admin') {
      queryFoundedBlogs = await this.blogsRepository
        .createQueryBuilder('b')
        .select([
          'b.id',
          'b.name',
          'b.description',
          'b.websiteUrl',
          'b.createdAt',
          'b.isMembership',
          'b.blogOwnerInfo',
        ])
        .where('b.name ilike :name', { name: `%${searchNameTerm}%` });
    } else {
      queryFoundedBlogs = await this.blogsRepository
        .createQueryBuilder('b')
        .select()
        .where('b.name ilike :name', { name: `%${searchNameTerm}%` });
    }

    let foundedBlogs: Blog[];
    if (userId && userId !== 'admin') {
      foundedBlogs = await queryFoundedBlogs
        .andWhere(`b.blogOwnerInfo ->> 'userId' = :userId`, { userId })
        .orderBy(`b.${sortBy}`, sortDir)
        .limit(pageSize)
        .offset((pageNumber - 1) * pageSize)
        .getMany();
    } else {
      foundedBlogs = await queryFoundedBlogs
        .orderBy(`b.${sortBy}`, sortDir)
        .limit(pageSize)
        .offset((pageNumber - 1) * pageSize)
        .getMany();
    }

    return {
      pagesCount: Math.ceil(Number(countedBlogs) / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: Number(countedBlogs),
      items: foundedBlogs,
    };
  }

  async getBlogById(id: string): Promise<blogViewModel | null> {
    return await this.blogsRepository.findOneBy({ id });
  }

  async getBlogByAdmin(id: string): Promise<adminBlogViewModel | null> {
    return await this.blogsRepository
      .createQueryBuilder('b')
      .select('b')
      .addSelect('b.blogOwnerInfo')
      .where('id = :id', { id })
      .getOne();
  }

  async getBlogByIdAndUserId(id: string, userId: string): Promise<blogViewModel | null> {
    return await this.blogsRepository
      .createQueryBuilder('b')
      .select()
      .where('b.id = :id', { id })
      .andWhere(`b.blogOwnerInfo ->> 'userId' = :userId`, { userId })
      .getOne();
  }
}
