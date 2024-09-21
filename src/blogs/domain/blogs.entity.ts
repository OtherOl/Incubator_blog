import { createBlogModel } from '../../common/types/blogs.model';
import { v4 as uuidv4 } from 'uuid';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Post } from '../../posts/domain/posts.entity';

class blogOwnerInfo {
  userId: string | null;
  userLogin: string | null;
}

@Entity({ name: 'Blog' })
export class Blog {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  websiteUrl: string;

  @Column()
  createdAt: string;

  @Column()
  isMembership: boolean;

  @Column({ nullable: false, select: false, type: 'jsonb' })
  blogOwnerInfo: blogOwnerInfo;

  @OneToMany(() => Post, (p) => p.blogsId, { onDelete: 'CASCADE' })
  posts: Post;

  static createNewBlog(inputData: createBlogModel, userId?: string, login?: string) {
    const blog = new Blog();

    blog.id = uuidv4();
    blog.name = inputData.name;
    blog.description = inputData.description;
    blog.websiteUrl = inputData.websiteUrl;
    blog.createdAt = new Date().toISOString();
    if (userId && login) {
      blog.blogOwnerInfo = {
        userId: userId,
        userLogin: login,
      };
    } else {
      blog.blogOwnerInfo = {
        userId: null,
        userLogin: null,
      };
    }
    blog.isMembership = false;

    return blog;
  }
}
