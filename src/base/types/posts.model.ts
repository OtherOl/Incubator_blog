import { likesInfo } from './likes.model';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';

const Trim = () => Transform(({ value }: TransformFnParams) => value?.trim());

function IsNotEmptyCustom() {
  return applyDecorators(IsString(), Trim(), IsNotEmpty());
}

export class createBlogPostModel {
  @IsNotEmpty()
  @IsNotEmptyCustom()
  @IsString()
  @Length(1, 30)
  title: string;

  @IsNotEmpty()
  @IsNotEmptyCustom()
  @IsString()
  @Length(1, 100)
  shortDescription: string;

  @IsNotEmpty()
  @IsNotEmptyCustom()
  @IsString()
  @Length(1, 1000)
  content: string;
}

export class postModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: likesInfo;
}
