import { IsEnum } from 'class-validator';

export type likesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: [];
};

export enum LikesEnum {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export class SendLikes {
  @IsEnum(LikesEnum)
  likeStatus: string;
}

export class CommentLikes {
  id: string;
  type: string;
  userId: string;
  commentId: string;
  addedAt: string;
  login: string;
}

export class PostLikes {
  id: string;
  type: string;
  userId: string;
  postId: string;
  addedAt: string;
  login: string;
}
