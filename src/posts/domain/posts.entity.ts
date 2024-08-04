import { v4 as uuidv4 } from 'uuid';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Blog } from '../../blogs/domain/blogs.entity';
import { Likes } from '../../likes/domain/likes.entity';
import { Comment } from '../../comments/domain/comments.entity';

export class LikesInfo {
  likesCount: number;

  dislikesCount: number;

  myStatus: string;

  newestLikes: [];
}

@Entity({ name: 'Post' })
export class Post {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  shortDescription: string;

  @Column()
  content: string;

  @Column()
  blogId: string;

  @ManyToOne(() => Blog, (b) => b.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogId' })
  blogsId: Blog;

  @Column()
  blogName: string;

  // @ManyToOne(() => Blog, (b) => b.posts)
  // @JoinColumn({ name: 'blogName' })
  // blogsName: Blog;

  @Column()
  createdAt: string;

  @Column({ type: 'jsonb' })
  extendedLikesInfo: LikesInfo;

  @OneToMany(() => Likes, (l) => l.postsId, { onDelete: 'CASCADE' })
  likes: Likes;

  @OneToMany(() => Comment, (c) => c.postId, { onDelete: 'CASCADE' })
  comments: Comment;

  static createNewPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
  ) {
    const post = new Post();

    post.id = uuidv4();
    post.title = title;
    post.shortDescription = shortDescription;
    post.content = content;
    post.blogId = blogId;
    post.blogName = blogName;
    post.createdAt = new Date().toISOString();
    post.extendedLikesInfo = { likesCount: 0, dislikesCount: 0, myStatus: 'None', newestLikes: [] };

    return post;
  }
}
