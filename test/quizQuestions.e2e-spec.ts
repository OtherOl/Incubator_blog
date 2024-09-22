import { INestApplication } from '@nestjs/common';
import { beforeGetAppAndCleanDb, questionCreateModel } from './utils/test-utils';
import request from 'supertest';
import { QuizQuestions } from '../src/game/quizQuestions/entities/quizQuestions.entity';
import { beforeAll, describe, expect, it } from '@jest/globals';

jest.setTimeout(20000);
describe('Test quizQuestions', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await beforeGetAppAndCleanDb();
  });

  it("shouldn't get all questions => 401 status", async () => {
    const questions = await request(app.getHttpServer()).get('/sa/quiz/questions').auth('Hacker', 'program');
    expect(questions.status).toBe(401);
  });

  it('should return an empty array of questions => 200 status', async () => {
    const questions = await request(app.getHttpServer()).get('/sa/quiz/questions').auth('admin', 'qwerty');
    expect(questions.status).toBe(200);
    expect(questions.body).toEqual({
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: [],
    });
  });

  it("Shouldn't create new question => 400 status (body)", async () => {
    const question = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .send(questionCreateModel('12345678', ['1', '2', '3']))
      .auth('admin', 'qwerty');
    expect(question.status).toBe(400);
    expect(question.body).toEqual({
      errorsMessages: [
        {
          message: 'body must be longer than or equal to 10 characters',
          field: 'body',
        },
      ],
    });
  });

  it("Shouldn't create new question => 400 status (correctAnswers)", async () => {
    const question = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .send({ body: '1234567898900asd', correctAnswers: 1 })
      .auth('admin', 'qwerty');
    expect(question.status).toBe(400);
    expect(question.body).toEqual({
      errorsMessages: [
        {
          message: 'correctAnswers must be an array',
          field: 'correctAnswers',
        },
      ],
    });
  });

  it("Shouldn't create new question => 400 status (body + correctAnswers)", async () => {
    const question = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .send({ body: 1, correctAnswers: 's' })
      .auth('admin', 'qwerty');
    expect(question.status).toBe(400);
    expect(question.body).toEqual({
      errorsMessages: [
        {
          message: 'body must be longer than or equal to 10 and shorter than or equal to 500 characters',
          field: 'body',
        },
        {
          message: 'correctAnswers must be an array',
          field: 'correctAnswers',
        },
      ],
    });
  });

  let question1: QuizQuestions;
  it('Should create new question => 201 status', async () => {
    const question = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .send(questionCreateModel('Is this correct question ?', ['Yes', 'Of course', 'BOMBOM']))
      .auth('admin', 'qwerty');
    expect(question.status).toBe(201);
    question1 = question.body;
    expect(question.body).toEqual({
      id: expect.any(String),
      body: 'Is this correct question ?',
      correctAnswers: ['Yes', 'Of course', 'BOMBOM'],
      published: false,
      createdAt: expect.any(String),
      updatedAt: null,
    });
  });

  it('Should return 1 question with pagination => 200 status', async () => {
    const questions = await request(app.getHttpServer()).get('/sa/quiz/questions').auth('admin', 'qwerty');
    expect(questions.status).toBe(200);
    expect(questions.body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 1,
      items: [
        {
          id: expect.any(String),
          body: 'Is this correct question ?',
          correctAnswers: ['Yes', 'Of course', 'BOMBOM'],
          published: false,
          createdAt: expect.any(String),
          updatedAt: null,
        },
      ],
    });
  });

  it("Shouldn't delete question by id => 404 status", async () => {
    const question = await request(app.getHttpServer())
      .delete('/sa/quiz/questions/123456789')
      .auth('admin', 'qwerty');
    expect(question.status).toBe(404);
  });

  it('Should delete question by id and return 1 question => 204 & 200 status', async () => {
    const question = await request(app.getHttpServer())
      .delete(`/sa/quiz/questions/${question1.id}`)
      .auth('admin', 'qwerty');
    expect(question.status).toBe(204);

    const questions = await request(app.getHttpServer()).get('/sa/quiz/questions').auth('admin', 'qwerty');
    expect(questions.status).toBe(200);
    expect(questions.body).toEqual({
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: [],
    });
  });

  let question2: QuizQuestions;
  it('Should create new question => 201 status', async () => {
    const createdQuestion = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .send(questionCreateModel('Is this question correct or no ?', ['1', '2', '3']))
      .auth('admin', 'qwerty');
    expect(createdQuestion.status).toBe(201);
    question2 = createdQuestion.body;
    expect(createdQuestion.body).toEqual({
      id: expect.any(String),
      body: 'Is this question correct or no ?',
      correctAnswers: ['1', '2', '3'],
      published: false,
      createdAt: expect.any(String),
      updatedAt: null,
    });
  });

  it("Shouldn't update question => 400 status", async () => {
    const question = await request(app.getHttpServer())
      .put(`/sa/quiz/questions/${question1.id}`)
      .send({ body: '12345678', correctAnswers: ['2', '3'] })
      .auth('admin', 'qwerty');
    expect(question.status).toBe(400);
    expect(question.body).toEqual({
      errorsMessages: [
        {
          message: 'body must be longer than or equal to 10 characters',
          field: 'body',
        },
      ],
    });
  });

  it("Shouldn't update question => 404 status", async () => {
    const question = await request(app.getHttpServer())
      .put(`/sa/quiz/questions/incorrectId`)
      .send(questionCreateModel('Is this correct question ?', ['1', '2', '3']))
      .auth('admin', 'qwerty');
    expect(question.status).toBe(404);
  });

  it('Should update question => 204 status', async () => {
    const questions = await request(app.getHttpServer())
      .put(`/sa/quiz/questions/${question2.id}`)
      .send(questionCreateModel('Update question and this is good', ['yes', 'no', 'maybe']))
      .auth('admin', 'qwerty');
    expect(questions.status).toBe(204);

    const getQuestions = await request(app.getHttpServer()).get('/sa/quiz/questions').auth('admin', 'qwerty');
    expect(getQuestions.status).toBe(200);
    expect(getQuestions.body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 1,
      items: [
        {
          id: expect.any(String),
          body: 'Update question and this is good',
          correctAnswers: ['yes', 'no', 'maybe'],
          published: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ],
    });
  });

  it("Shouldn't update question published => 400 status", async () => {
    const question = await request(app.getHttpServer())
      .put(`/sa/quiz/questions/${question2.id}/publish`)
      .send({ publish: 1 })
      .auth('admin', 'qwerty');
    expect(question.status).toBe(400);
    expect(question.body).toEqual({
      errorsMessages: [
        {
          message: 'published must be a boolean value',
          field: 'published',
        },
      ],
    });
  });

  it('Should update question published => 204 status', async () => {
    const question = await request(app.getHttpServer())
      .put(`/sa/quiz/questions/${question2.id}/publish`)
      .send({ published: true })
      .auth('admin', 'qwerty');
    expect(question.status).toBe(204);
  });
});
