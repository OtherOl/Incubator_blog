import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogsQueryRepository } from '../../blogs/repositories/blogs.query-repository';

@ValidatorConstraint({ name: 'CustomBlogId', async: true })
@Injectable()
export class CustomBlogIdValidation implements ValidatorConstraintInterface {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  async validate(blogId: string, args: ValidationArguments) {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);
    if (!blog) {
      return false;
    } else {
      return true;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Blog doesn't exist`;
  }
}
