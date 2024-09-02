import { INestApplication } from '@nestjs/common';
import { beforeGetAppAndCleanDb, blogModel } from './utils/test-utils';
import { blogViewModel } from '../src/common/types/blogs.model';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import request from 'supertest';

jest.setTimeout(20000);
describe('Testing Blogs', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await beforeGetAppAndCleanDb();
  });

  afterAll(async () => {
    await app.close();
  });

  it("shouldn't create newBlog => 401 status", async () => {
    const createdBlog = await request(app.getHttpServer())
      .post('/sa/blogs')
      .send(blogModel('pox', 'pox', 'pox'))
      .auth('Hacker', 'qwerty');

    expect(createdBlog.status).toBe(401);
  });

  it("shouldn't create newBlog => 400 status", async () => {
    const createdBlog = await request(app.getHttpServer())
      .post('/sa/blogs')
      .send(blogModel('pox', 'pox', 'pox'))
      .auth('admin', 'qwerty');

    expect(createdBlog.status).toBe(400);
  });

  let blog1: blogViewModel;
  it('should create new blog => 201 status', async () => {
    const createdBlog = await request(app.getHttpServer())
      .post('/sa/blogs')
      .send(blogModel('First blog', 'My line life is going higher', 'youtube.com'))
      .auth('admin', 'qwerty');

    expect(createdBlog.status).toBe(201);
    blog1 = createdBlog.body;
    expect(createdBlog.body).toEqual({
      id: expect.any(String),
      name: 'First blog',
      description: 'My line life is going higher',
      websiteUrl: 'youtube.com',
      createdAt: expect.any(String),
      isMembership: false,
    });
  });

  it("shouldn't return blog by id => 404 status", async () => {
    const blog = await request(app.getHttpServer())
      .get('/sa/blogs/2e4f5446-6045-4db3-b2e3-887d12f6aaca')
      .send();

    expect(blog.status).toBe(404);
  });

  it('should return blog by id => 200 status', async () => {
    const blog = await request(app.getHttpServer()).get(`/blogs/${blog1.id}`);
    expect(blog.status).toBe(200);
    expect(blog.body).toEqual({
      id: blog1.id,
      name: blog1.name,
      description: blog1.description,
      websiteUrl: blog1.websiteUrl,
      createdAt: expect.any(String),
      isMembership: false,
    });
  });

  it('should update blog => 204 status', async () => {
    const updatedBlog = await request(app.getHttpServer())
      .put(`/sa/blogs/${blog1.id}`)
      .send({ name: 'Updated blog', description: 'Valid text', websiteUrl: 'OKKEEEY.com' })
      .auth('admin', 'qwerty');

    expect(updatedBlog.status).toBe(204);

    const blog = await request(app.getHttpServer()).get(`/blogs/${blog1.id}`);

    expect(blog.status).toBe(200);
    expect(blog.body).toEqual({
      id: blog1.id,
      name: 'Updated blog',
      description: expect.any(String),
      websiteUrl: expect.any(String),
      createdAt: expect.any(String),
      isMembership: false,
    });
  });

  it("shouldn't delete blog by id => 404 status", async () => {
    const deletedBlog = await request(app.getHttpServer())
      .delete(`/sa/2e4f5446-6045-4db3-b2e3-887d12f6aaca`)
      .auth('admin', 'qwerty');

    expect(deletedBlog.status).toBe(404);
  });

  it('should delete blog by id => 204 status', async () => {
    const newBlog = await request(app.getHttpServer())
      .post('/sa/blogs')
      .send(blogModel('Hello world', 'At this moment i will create my own future!', 'myfuture.com'))
      .auth('admin', 'qwerty');
    expect(newBlog.status).toBe(201);

    const deletedBlog = await request(app.getHttpServer())
      .delete(`/sa/blogs/${newBlog.body.id}`)
      .auth('admin', 'qwerty');

    expect(deletedBlog.status).toBe(204);

    const isExists = await request(app.getHttpServer()).get(`/sa/blogs/${newBlog.body.id}`).send();

    expect(isExists.status).toBe(404);
  });

  let blog2: blogViewModel;
  it('should create Post by blogId => 201 status', async () => {
    const newBlog = await request(app.getHttpServer())
      .post('/sa/blogs')
      .send({ name: 'Hello YouTube', description: 'About my life', websiteUrl: 'google.com' })
      .auth('admin', 'qwerty');
    blog2 = newBlog.body;
    expect(newBlog.status).toBe(201);

    const post = await request(app.getHttpServer())
      .post(`/sa/blogs/${blog2.id}/posts`)
      .send({
        title: 'Post created by static method',
        shortDescription: 'We are doing likes and dislikes for posts',
        content: 'yesyesyesyesyesyesye',
      })
      .auth('admin', 'qwerty');

    expect(post.status).toBe(201);
    expect(post.body).toEqual({
      id: expect.any(String),
      title: post.body.title,
      shortDescription: post.body.shortDescription,
      content: post.body.content,
      blogId: post.body.blogId,
      blogName: post.body.blogName,
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
