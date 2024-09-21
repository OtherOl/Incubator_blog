import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { postModel } from '../../common/types/posts.model';
import { paginationModel } from '../../common/types/pagination.model';
import { commentsModel } from '../../common/types/comments.model';
import { LikesQueryRepository } from '../../likes/repositories/likes.query-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../domain/posts.entity';
import { Comment } from '../../comments/domain/comments.entity';
import { sortDirectionHelper } from '../../common/helpers/sortDirection.helper';
import { Blog } from '../../blogs/domain/blogs.entity';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    @InjectRepository(Blog) private readonly blogsRepository: Repository<Blog>,
    @InjectRepository(Comment) private readonly commentsRepository: Repository<Comment>,
    private readonly likesQueryRepository: LikesQueryRepository,
  ) {}

  async getCommentsByPostId(
    postId: string,
    sortBy: string = 'createdAt',
    sortDirection: string = 'DESC',
    pageNumber: number,
    pageSize: number,
    userId: string,
  ): Promise<paginationModel<commentsModel>> {
    const sortDir = sortDirectionHelper(sortDirection);
    const countComments = await this.commentsRepository
      .createQueryBuilder('c')
      .select()
      .where('c.postId = :postId', { postId })
      .getCount();
    if (countComments === 0) throw new NotFoundException("Comments with this id aren't exists");

    const foundedComments = await this.commentsRepository
      .createQueryBuilder('c')
      .select()
      .where('c.postId = :postId', { postId })
      .orderBy(`c.${sortBy}`, sortDir)
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .getMany();

    const like = await this.likesQueryRepository.getLikeByUserId(userId);
    const commentsQuery: any[] = foundedComments.map((comment) => {
      let likeStatus: string;
      if (!like) {
        likeStatus = 'None';
      } else {
        const status = like.find((like) => like.commentId === comment.id);
        if (!status) {
          likeStatus = 'None';
        } else {
          likeStatus = status.type;
        }
      }

      return {
        id: comment.id,
        content: comment.content,
        commentatorInfo: {
          userId: comment.commentatorInfo.userId,
          userLogin: comment.commentatorInfo.userLogin,
        },
        createdAt: comment.createdAt,
        likesInfo: {
          likesCount: comment.likesInfo.likesCount,
          dislikesCount: comment.likesInfo.dislikesCount,
          myStatus: likeStatus,
        },
      };
    });

    return {
      pagesCount: Math.ceil(countComments / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: countComments,
      items: commentsQuery,
    };
  }

  async getAllPosts(
    sortBy: string = 'createdAt',
    sortDirection: string = 'DESC',
    pageNumber: number,
    pageSize: number,
    userId: string,
  ): Promise<paginationModel<postModel>> {
    const sortDir = sortDirectionHelper(sortDirection);
    const countPosts: number = await this.postsRepository.createQueryBuilder().select().getCount();

    const foundedPosts = await this.postsRepository
      .createQueryBuilder('p')
      .select()
      .orderBy(`p.${sortBy}`, sortDir)
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .getMany();
    const like = await this.likesQueryRepository.getLikeByUserId(userId);
    const likes = await this.likesQueryRepository.getNewestLikes('Like');

    const postsQuery: any[] = foundedPosts.map((post) => {
      let likeStatus: string;
      if (!like) {
        likeStatus = 'None';
      } else {
        const status = like.find((l) => l.postId === post.id);
        if (!status) {
          likeStatus = 'None';
        } else {
          likeStatus = status.type;
        }
      }

      let newestLikes: any[];

      if (!likes) {
        newestLikes = [];
      } else {
        newestLikes = likes
          .filter((l) => l.postId === post.id)
          .map((like) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { postId, id, type, commentId, ...rest } = like;
            return rest;
          })
          .slice(0, 3);
      }

      return {
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: post.extendedLikesInfo.likesCount,
          dislikesCount: post.extendedLikesInfo.dislikesCount,
          myStatus: likeStatus,
          newestLikes: newestLikes,
        },
      };
    });
    return {
      pagesCount: Math.ceil(countPosts / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: countPosts,
      items: postsQuery,
    };
  }

  async getAllPostsByBlogId(
    blogId: string,
    sortBy: string = 'createdAt',
    sortDirection: string = 'DESC',
    pageNumber: number,
    pageSize: number,
    userId: string,
    isBlogger?: boolean,
  ): Promise<paginationModel<postModel>> {
    if (isBlogger) {
      const blog = await this.blogsRepository.findOneBy({ id: blogId });
      if (!blog) throw new NotFoundException("Blog doesn't exists");
      const isBelong = await this.blogsRepository
        .createQueryBuilder('b')
        .select()
        .where('b.id = :id', { id: blogId })
        .andWhere('b.blogOwnerInfo ::jsonb @> blogOwnerInfo', { blogOwnerInfo: { userId } })
        .getOne();
      if (!isBelong) throw new ForbiddenException("Blog doesn't belong to you");
    }
    const sortDir = sortDirectionHelper(sortDirection);
    const countPosts: number = await this.postsRepository
      .createQueryBuilder('p')
      .select()
      .where('p.blogId = :blogId', { blogId })
      .getCount();

    if (countPosts === 0) throw new NotFoundException("Blog doesn't exists");

    const foundedPosts = await this.postsRepository
      .createQueryBuilder('p')
      .select()
      .where('p.blogId = :blogId', { blogId })
      .orderBy(`p.${sortBy}`, sortDir)
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .getMany();

    const postLike = await this.likesQueryRepository.getLikeByUserId(userId);
    const likes = await this.likesQueryRepository.getNewestLikes('Like');

    const postsQuery: any[] = foundedPosts.map((post) => {
      let likeStatus: string;
      if (!postLike) {
        likeStatus = 'None';
      } else {
        const postStatus = postLike.find((l) => l.postId === post.id);
        if (!postStatus) {
          likeStatus = 'None';
        } else {
          likeStatus = postStatus.type;
        }
      }

      let newestPostLikes: any[];

      if (!likes) {
        newestPostLikes = [];
      } else {
        newestPostLikes = likes
          .filter((l) => l.postId === post.id)
          .map((like) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { postId, id, type, commentId, ...rest } = like;
            return rest;
          })
          .slice(0, 3);
      }

      return {
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: post.extendedLikesInfo.likesCount,
          dislikesCount: post.extendedLikesInfo.dislikesCount,
          myStatus: likeStatus,
          newestLikes: newestPostLikes,
        },
      };
    });

    return {
      pagesCount: Math.ceil(countPosts / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: countPosts,
      items: postsQuery,
    };
  }

  async getPostByBlogId(blogId: string): Promise<Post | null> {
    return await this.postsRepository.findOneBy({ blogId });
  }

  async getPostByIdSQL(postId: string): Promise<Post | null> {
    return await this.postsRepository.findOneBy({ id: postId });
  }

  async getPostById(postId: string, userId: string): Promise<postModel | null> {
    let likeStatus: string;
    const post = await this.postsRepository.findOneBy({ id: postId });
    const like = await this.likesQueryRepository.getLikeByPostId(userId, postId);
    if (!post) throw new NotFoundException("Post doesn't exists");
    like ? (likeStatus = like.type) : (likeStatus = 'None');
    const likes = await this.likesQueryRepository.getNewestLikeForCurrentPost(postId, 'Like');
    let newestLikes;
    likes ? (newestLikes = likes) : (newestLikes = []);

    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: post.extendedLikesInfo.likesCount,
        dislikesCount: post.extendedLikesInfo.dislikesCount,
        myStatus: likeStatus,
        newestLikes: newestLikes,
      },
    };
  }
}
