import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { beforeGetAppAndCleanDb, blogModel, postCreateModel, userCreateModel } from './utils/test-utils';
import { blogViewModel } from '../src/common/types/blogs.model';
import { postModel } from '../src/common/types/posts.model';
import { userModel } from '../src/common/types/users.model';
import { beforeAll, describe, expect, it } from '@jest/globals';

jest.setTimeout(20000);
describe('Testing comments', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await beforeGetAppAndCleanDb();
  });

  let commentsBlog1: blogViewModel;
  it('should create new blog => 201 status', async () => {
    const blog = await request(app.getHttpServer())
      .post('/sa/blogs')
      .send(blogModel('Totally not', 'This description is about description', 'google.com'))
      .auth('admin', 'qwerty');
    commentsBlog1 = blog.body;
    expect(blog.status).toBe(201);
  });

  let commentsPost1: postModel;
  it('should create new post => 201 status', async () => {
    const post = await request(app.getHttpServer())
      .post(`/sa/blogs/${commentsBlog1.id}/posts`)
      .send(postCreateModel('Title', 'HOHOH YES YES YES', 'We should learn modern techniques'))
      .auth('admin', 'qwerty');

    commentsPost1 = post.body;
    expect(post.status).toBe(201);
  });

  let commentsUser1: userModel;
  it('Should create new Comment + get comment => 201 status', async () => {
    const createdUser = await request(app.getHttpServer())
      .post('/sa/users')
      .send(userCreateModel('pekeer', 'qwerty', 'pilya00@gmail.com'))
      .auth('admin', 'qwerty');

    commentsUser1 = createdUser.body;
    expect(createdUser.status).toBe(201);
    expect(createdUser.body).toEqual({
      id: commentsUser1.id,
      login: commentsUser1.login,
      email: commentsUser1.email,
      createdAt: expect.any(String),
    });

    const login = await request(app.getHttpServer()).post('/auth/login').send({
      loginOrEmail: commentsUser1.login,
      password: 'qwerty',
    });

    expect(login.status).toBe(200);
    expect(login.body).toEqual({
      accessToken: expect.any(String),
    });

    const comment = await request(app.getHttpServer())
      .post(`/posts/${commentsPost1.id}/comments`)
      .send({
        content: "COMMENT 2 BY NEW USER WITH NAME: 'OtherOl'",
      })
      .set('Authorization', 'bearer ' + login.body.accessToken);

    expect(comment.status).toBe(201);
    expect(comment.body).toEqual({
      id: comment.body.id,
      content: comment.body.content,
      commentatorInfo: {
        userId: comment.body.commentatorInfo.userId,
        userLogin: comment.body.commentatorInfo.userLogin,
      },
      createdAt: comment.body.createdAt,
      likesInfo: {
        likesCount: comment.body.likesInfo.likesCount,
        dislikesCount: comment.body.likesInfo.dislikesCount,
        myStatus: comment.body.likesInfo.myStatus,
      },
    });

    const getComment = await request(app.getHttpServer()).get(`/comments/${comment.body.id}`);
    expect(getComment.status).toBe(200);
    expect(getComment.body).toEqual({
      id: comment.body.id,
      content: comment.body.content,
      commentatorInfo: {
        userId: comment.body.commentatorInfo.userId,
        userLogin: comment.body.commentatorInfo.userLogin,
      },
      createdAt: comment.body.createdAt,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
      },
    });
  });

  it("shouldn't create new comment => 400 status", async () => {
    const login = await request(app.getHttpServer()).post('/auth/login').send({
      loginOrEmail: commentsUser1.login,
      password: 'qwerty',
    });
    expect(login.status).toBe(200);
    expect(login.body).toEqual({
      accessToken: expect.any(String),
    });

    const comment = await request(app.getHttpServer())
      .post(`/posts/${commentsPost1.id}/comments`)
      .send({
        content: '400',
      })
      .set('Authorization', 'bearer ' + login.body.accessToken);

    expect(comment.status).toBe(400);
  });
});

describe('Testing comments likes', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await beforeGetAppAndCleanDb();
  });

  let likesBlog1: blogViewModel;
  it('should create new blog => 201 status', async () => {
    const blog = await request(app.getHttpServer())
      .post('/sa/blogs')
      .send(blogModel('Not new blog', 'This description is about description', 'google.com'))
      .auth('admin', 'qwerty');
    likesBlog1 = blog.body;
    expect(blog.status).toBe(201);
  });

  let likesPost1: postModel;
  it('should create new post => 201 status', async () => {
    const post = await request(app.getHttpServer())
      .post(`/sa/blogs/${likesBlog1.id}/posts`)
      .send(postCreateModel('Not title', 'H YES YES YES', 'We should learn modern techniques'))
      .auth('admin', 'qwerty');

    likesPost1 = post.body;
    expect(post.status).toBe(201);
  });

  let likesUser1: userModel;
  it('should do like for comment => 204 status', async () => {
    const createdUser = await request(app.getHttpServer())
      .post('/sa/users')
      .send(userCreateModel('user5', '12345678', 'hohoh@gmail.com'))
      .auth('admin', 'qwerty');
    likesUser1 = createdUser.body;
    expect(createdUser.status).toBe(201);

    const login = await request(app.getHttpServer()).post('/auth/login').send({
      loginOrEmail: likesUser1.login,
      password: '12345678',
    });
    expect(login.status).toBe(200);

    const comment = await request(app.getHttpServer())
      .post(`/posts/${likesPost1.id}/comments`)
      .send({
        content: "This comment in usage for test: 'OtherOl'",
      })
      .set('Authorization', 'bearer ' + login.body.accessToken);
    expect(comment.status).toBe(201);

    const like = await request(app.getHttpServer())
      .put(`/comments/${comment.body.id}/like-status`)
      .send({ likeStatus: 'Like' })
      .set('Authorization', 'bearer ' + login.body.accessToken);
    expect(like.status).toBe(204);

    const getComment = await request(app.getHttpServer())
      .get(`/comments/${comment.body.id}`)
      .set('Authorization', 'bearer ' + login.body.accessToken);
    expect(getComment.status).toBe(200);
    expect(getComment.body).toEqual({
      id: getComment.body.id,
      content: getComment.body.content,
      commentatorInfo: {
        userId: getComment.body.commentatorInfo.userId,
        userLogin: getComment.body.commentatorInfo.userLogin,
      },
      createdAt: getComment.body.createdAt,
      likesInfo: {
        likesCount: getComment.body.likesInfo.likesCount,
        dislikesCount: getComment.body.likesInfo.dislikesCount,
        myStatus: 'Like',
      },
    });

    const commentsPostId = await request(app.getHttpServer())
      .get(`/posts/${likesPost1.id}/comments`)
      .set('Authorization', 'bearer ' + login.body.accessToken);
    expect(commentsPostId.status).toBe(200);
    expect(commentsPostId.body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 1,
      items: [
        {
          id: comment.body.id,
          content: comment.body.content,
          commentatorInfo: {
            userId: comment.body.commentatorInfo.userId,
            userLogin: comment.body.commentatorInfo.userLogin,
          },
          createdAt: comment.body.createdAt,
          likesInfo: {
            likesCount: 1,
            dislikesCount: 0,
            myStatus: 'Like',
          },
        },
      ],
    });
  });
});
