import { v4 as uuidv4 } from 'uuid';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Post } from '../../posts/entities/posts.entity';
import { User } from '../../users/entities/users.entity';

@Entity({ name: 'Likes' })
export class Likes {
  @PrimaryColumn()
  id: string;

  @Column()
  type: string;

  @Column()
  addedAt: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (u) => u.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  usersId: User;

  @Column({ nullable: true })
  postId: string;

  @ManyToOne(() => Post, (p) => p.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  postsId: Post;

  @Column({ nullable: true })
  commentId: string;

  @Column()
  login: string;

  static createCommentLike(userId: string, commentId: string, type: string, login: string) {
    const commentLike = new Likes();

    commentLike.id = uuidv4();
    commentLike.type = type;
    commentLike.userId = userId;
    commentLike.commentId = commentId;
    commentLike.addedAt = new Date().toISOString();
    commentLike.login = login;

    return commentLike;
  }

  static createPostLike(userId: string, postId: string, type: string, userLogin: string) {
    const postLike = new Likes();

    postLike.id = uuidv4();
    postLike.type = type;
    postLike.addedAt = new Date().toISOString();
    postLike.userId = userId;
    postLike.postId = postId;
    postLike.login = userLogin;

    return postLike;
  }
}
