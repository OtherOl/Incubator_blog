import { Injectable } from '@nestjs/common';
import { blogViewModel } from '../../common/types/blogs.model';
import { paginationModel } from '../../common/types/pagination.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ): Promise<paginationModel<blogViewModel>> {
    const sortDir = sortDirectionHelper(sortDirection);
    const countBlogs = await this.blogsRepository
      .createQueryBuilder('b')
      .where('b.name ilike :name', { name: `%${searchNameTerm}%` })
      .getCount();

    const foundedBlogs = await this.blogsRepository
      .createQueryBuilder('b')
      .where('b.name ilike :name', { name: `%${searchNameTerm}%` })
      .orderBy(`b.${sortBy}`, sortDir)
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .getMany();

    return {
      pagesCount: Math.ceil(Number(countBlogs) / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: Number(countBlogs),
      items: foundedBlogs,
    };
  }

  async getBlogById(id: string): Promise<blogViewModel | null> {
    return await this.blogsRepository.findOneBy({ id });
  }
}
