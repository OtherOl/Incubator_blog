import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { beforeGetAppAndCleanDb, blogModel, postCreateModel, userCreateModel } from './utils/test-utils';
import { blogViewModel } from '../src/common/types/blogs.model';
import { postModel } from '../src/common/types/posts.model';
import { userModel } from '../src/common/types/users.model';

jest.setTimeout(20000);
describe('Testing Posts', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await beforeGetAppAndCleanDb();
  });

  afterAll(async () => {
    const db = await request(app.getHttpServer()).delete('/testing/all-data').send();
    expect(db.status).toBe(204);
    await app.close();
  });

  it('should return empty array (GET: getAllPosts) => 200 status', async () => {
    const posts = await request(app.getHttpServer()).get('/posts');

    expect(posts.status).toBe(200);
    expect(posts.body).toEqual({
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: [],
    });
  });

  it("shouldn't return response (Get: getPostsByBlogId) => 404 status", async () => {
    const posts = await request(app.getHttpServer())
      .get(`/sa/blogs/${uuidv4()}/posts`)
      .auth('admin', 'qwerty');

    expect(posts.status).toBe(404);
  });

  let blog1: blogViewModel;
  let post1: postModel;
  it('should create new post and return it (Post: createBlog, createPostForBlog; Get: getPostById) => 201 status + 200 status', async () => {
    const blog = await request(app.getHttpServer())
      .post('/sa/blogs')
      .send(blogModel('Posts blog', 'This text is about..', 'google.com'))
      .auth('admin', 'qwerty');

    expect(blog.status).toBe(201);
    blog1 = blog.body;

    const newPost = await request(app.getHttpServer())
      .post(`/sa/blogs/${blog1.id}/posts`)
      .send(postCreateModel('JojoBen', 'We will talk about our lessons.', 'HOHO mr. ej es or no?????'))
      .auth('admin', 'qwerty');

    post1 = newPost.body;
    expect(newPost.status).toBe(201);
    expect(newPost.body).toEqual({
      id: newPost.body.id,
      title: newPost.body.title,
      shortDescription: newPost.body.shortDescription,
      content: newPost.body.content,
      blogId: newPost.body.blogId,
      blogName: newPost.body.blogName,
      createdAt: newPost.body.createdAt,
      extendedLikesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    });

    const foundedPost = await request(app.getHttpServer()).get(`/posts/${post1.id}`);

    expect(foundedPost.status).toBe(200);
    expect(foundedPost.body).toEqual({
      id: newPost.body.id,
      title: newPost.body.title,
      shortDescription: newPost.body.shortDescription,
      content: newPost.body.content,
      blogId: newPost.body.blogId,
      blogName: newPost.body.blogName,
      createdAt: newPost.body.createdAt,
      extendedLikesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    });
  });

  it('Should update post (Get: getAllPosts, Put: updatePostByBlogId) => status 204', async () => {
    const updatedPost = await request(app.getHttpServer())
      .put(`/sa/blogs/${post1.blogId}/posts/${post1.id}`)
      .send({
        content: 'Update post in tests',
        shortDescription: 'shortDescription after update',
        title: 'title updated',
      })
      .auth('admin', 'qwerty');

    expect(updatedPost.status).toBe(204);

    const post = await request(app.getHttpServer()).get(`/posts/${post1.id}`);
    expect(post.status).toBe(200);
    expect(post.body).toEqual({
      id: post1.id,
      title: 'title updated',
      shortDescription: 'shortDescription after update',
      content: 'Update post in tests',
      blogId: post1.blogId,
      blogName: expect.any(String),
      createdAt: expect.any(String),
      extendedLikesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    });
  });
});

describe('Testing post likes', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await beforeGetAppAndCleanDb();
  });

  let user1: userModel;
  let blog1: blogViewModel;
  let post1: postModel;
  it('should like post + successfully get post by blogId  => 204 status', async () => {
    const newUser = await request(app.getHttpServer())
      .post('/sa/users')
      .send(userCreateModel('OtherOl', '12345678', 'someemail@gmail.com'))
      .auth('admin', 'qwerty');
    expect(newUser.status).toBe(201);
    user1 = newUser.body;

    const newBlog = await request(app.getHttpServer())
      .post('/sa/blogs')
      .send(blogModel('Old blog', 'Seat with my cat ^)', 'google.com'))
      .auth('admin', 'qwerty');
    expect(newBlog.status).toBe(201);
    blog1 = newBlog.body;

    const newPost = await request(app.getHttpServer())
      .post(`/sa/blogs/${newBlog.body.id}/posts`)
      .send(postCreateModel('Some post', 'Some short description!', 'This post is about IT'))
      .auth('admin', 'qwerty');
    expect(newPost.status).toBe(201);
    post1 = newPost.body;

    const login = await request(app.getHttpServer()).post('/auth/login').send({
      loginOrEmail: user1.login,
      password: '12345678',
    });
    expect(login.status).toBe(200);

    const like = await request(app.getHttpServer())
      .put(`/posts/${post1.id}/like-status`)
      .send({ likeStatus: 'Like' })
      .set('Authorization', 'bearer ' + login.body.accessToken);
    expect(like.status).toBe(204);

    const post = await request(app.getHttpServer())
      .get(`/posts/${post1.id}`)
      .set('Authorization', 'bearer ' + login.body.accessToken);
    expect(post.status).toBe(200);
    expect(post.body).toEqual({
      id: post1.id,
      title: expect.any(String),
      shortDescription: expect.any(String),
      content: expect.any(String),
      blogId: expect.any(String),
      blogName: expect.any(String),
      createdAt: expect.any(String),
      extendedLikesInfo: {
        likesCount: 1,
        dislikesCount: 0,
        myStatus: 'Like',
        newestLikes: [{ addedAt: expect.any(String), login: user1.login, userId: expect.any(String) }],
      },
    });

    const postsByBlogId = await request(app.getHttpServer())
      .get(`/blogs/${blog1.id}/posts`)
      .set('Authorization', 'bearer ' + login.body.accessToken);
    expect(postsByBlogId.status).toBe(200);
    expect(postsByBlogId.body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 1,
      items: [
        {
          id: expect.any(String),
          shortDescription: expect.any(String),
          title: expect.any(String),
          content: expect.any(String),
          blogId: blog1.id,
          blogName: expect.any(String),
          createdAt: expect.any(String),
          extendedLikesInfo: {
            likesCount: 1,
            dislikesCount: 0,
            myStatus: 'Like',
            newestLikes: [{ addedAt: expect.any(String), login: user1.login, userId: expect.any(String) }],
          },
        },
      ],
    });
  });

  it("shouldn't do like => 404 status", async () => {
    const login = await request(app.getHttpServer()).post('/auth/login').send({
      loginOrEmail: user1.login,
      password: '12345678',
    });
    expect(login.status).toBe(200);

    const like = await request(app.getHttpServer())
      .put(`/posts/${uuidv4()}/like-status`)
      .send({ likeStatus: 'Like' })
      .set('Authorization', 'bearer ' + login.body.accessToken);
    expect(like.status).toBe(404);
  });

  it("shouldn't do like => 401 status", async () => {
    const like = await request(app.getHttpServer())
      .put(`/posts/${post1.id}/like-status`)
      .send({ likeStatus: 'Like' })
      .set('Authorization', 'bearer ' + uuidv4());
    expect(like.status).toBe(401);
  });
});
