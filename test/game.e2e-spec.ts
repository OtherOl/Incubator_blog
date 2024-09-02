import { INestApplication } from '@nestjs/common';
import { beforeGetAppAndCleanDb, questionCreateModel, userCreateModel } from './utils/test-utils';
import { userModel } from '../src/common/types/users.model';
import request from 'supertest';
import { GameViewModel, QuestionsViewModel } from '../src/common/types/game.model';
import { QuizQuestions } from '../src/game/quizQuestions/domain/quizQuestions.entity';
import { beforeAll, describe, expect, it } from '@jest/globals';

jest.setTimeout(25000);
describe('Testing Game', () => {
  let app: INestApplication;
  beforeAll(async () => {
    app = await beforeGetAppAndCleanDb();
  });

  let user1: userModel;
  let accessToken1: string;
  it('should create user1 and login user1 => 201 status', async () => {
    const newUser1 = await request(app.getHttpServer())
      .post('/sa/users')
      .send(userCreateModel('OtherOl', 'qwerty', 'pilya003@gmail.com'))
      .auth('admin', 'qwerty');
    expect(newUser1.status).toBe(201);
    user1 = newUser1.body;

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ loginOrEmail: user1.login, password: 'qwerty' });
    expect(login.status).toBe(200);
    accessToken1 = login.body.accessToken;
  });

  let user2: userModel;
  let accessToken2: string;
  it('should create user2 and login user2 => 201 status', async () => {
    const newUser2 = await request(app.getHttpServer())
      .post('/sa/users')
      .send(userCreateModel('User2', '12345678', 'pilya00@gmail.com'))
      .auth('admin', 'qwerty');
    expect(newUser2.status).toBe(201);
    user2 = newUser2.body;

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ loginOrEmail: user2.login, password: '12345678' });
    expect(login.status).toBe(200);
    accessToken2 = login.body.accessToken;
  });

  let user3: userModel;
  let accessToken3: string;
  it('should create user3 and login user3 => 201 status', async () => {
    const newUser3 = await request(app.getHttpServer())
      .post('/sa/users')
      .send(userCreateModel('User3', '12345678', 'pilya0@gmail.com'))
      .auth('admin', 'qwerty');
    expect(newUser3.status).toBe(201);
    user3 = newUser3.body;

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ loginOrEmail: user3.login, password: '12345678' });
    expect(login.status).toBe(200);
    accessToken3 = login.body.accessToken;
  });

  const questions: QuizQuestions[] = [];
  it('Should create 5 new question => 201 status', async () => {
    const createdQuestion1 = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .send(questionCreateModel('Is this correct question ?', ['Yes', 'Of course']))
      .auth('admin', 'qwerty');
    expect(createdQuestion1.status).toBe(201);
    questions.push(createdQuestion1.body);
    expect(createdQuestion1.body).toEqual({
      id: expect.any(String),
      body: 'Is this correct question ?',
      correctAnswers: ['Yes', 'Of course'],
      published: false,
      createdAt: expect.any(String),
      updatedAt: null,
    });

    const createdQuestion2 = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .send(questionCreateModel('How much is this cost ?', ['100', 'one hundred']))
      .auth('admin', 'qwerty');
    expect(createdQuestion2.status).toBe(201);
    questions.push(createdQuestion2.body);
    expect(createdQuestion2.body).toEqual({
      id: expect.any(String),
      body: 'How much is this cost ?',
      correctAnswers: ['100', 'one hundred'],
      published: false,
      createdAt: expect.any(String),
      updatedAt: null,
    });

    const createdQuestion3 = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .send(questionCreateModel('Convert this money => 200 usd ?', ['550 BYN', '20000 RUB']))
      .auth('admin', 'qwerty');
    expect(createdQuestion3.status).toBe(201);
    questions.push(createdQuestion3.body);
    expect(createdQuestion3.body).toEqual({
      id: expect.any(String),
      body: 'Convert this money => 200 usd ?',
      correctAnswers: ['550 BYN', '20000 RUB'],
      published: false,
      createdAt: expect.any(String),
      updatedAt: null,
    });

    const createdQuestion4 = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .send(questionCreateModel('What music do i listen now ?', ['Bring me the horizon', 'Metal', 'Rock']))
      .auth('admin', 'qwerty');
    expect(createdQuestion4.status).toBe(201);
    questions.push(createdQuestion4.body);
    expect(createdQuestion4.body).toEqual({
      id: expect.any(String),
      body: 'What music do i listen now ?',
      correctAnswers: ['Bring me the horizon', 'Metal', 'Rock'],
      published: false,
      createdAt: expect.any(String),
      updatedAt: null,
    });

    const createdQuestion5 = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .send(questionCreateModel('Am i have a cat or a dog ?', ['Of course', 'You have both of them']))
      .auth('admin', 'qwerty');
    expect(createdQuestion5.status).toBe(201);
    questions.push(createdQuestion5.body);
    expect(createdQuestion5.body).toEqual({
      id: expect.any(String),
      body: 'Am i have a cat or a dog ?',
      correctAnswers: ['Of course', 'You have both of them'],
      published: false,
      createdAt: expect.any(String),
      updatedAt: null,
    });
  });

  let questionsViewModel: QuestionsViewModel[];
  it('Should publish 5 questions => 204 status', async () => {
    for (let i = 0; i < 5; i++) {
      const updatedQuestion = await request(app.getHttpServer())
        .put(`/sa/quiz/questions/${questions[i].id}/publish`)
        .send({ published: true })
        .auth('admin', 'qwerty');
      expect(updatedQuestion.status).toBe(204);
    }
    questionsViewModel = [
      {
        id: questions[0].id,
        body: questions[0].body,
      },
      {
        id: questions[1].id,
        body: questions[1].body,
      },
      {
        id: questions[2].id,
        body: questions[2].body,
      },
      {
        id: questions[3].id,
        body: questions[3].body,
      },
      {
        id: questions[4].id,
        body: questions[4].body,
      },
    ];
  });

  it("Shouldn't return, because user doesn't playing => 404 status", async () => {
    const game = await request(app.getHttpServer())
      .get('/pair-game-quiz/pairs/my-current')
      .set('Authorization', 'bearer ' + accessToken1);
    expect(game.status).toBe(404);
  });

  it("Shouldn't return and create/connect game => 401 status", async () => {
    const getGame = await request(app.getHttpServer())
      .get('/pair-game-quiz/pairs/my-current')
      .set('Authorization', 'bearer THISISNOTTOKEN');
    expect(getGame.status).toBe(401);

    const createGame = await request(app.getHttpServer()).post('/pair-game-quiz/pairs/connection');
    expect(createGame.status).toBe(401);
  });

  let game1: GameViewModel;
  it('should create new game and return it twice => 200 status', async () => {
    const createdGame = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/connection')
      .set('Authorization', 'bearer ' + accessToken1);
    expect(createdGame.status).toBe(200);
    expect(createdGame.body).toEqual({
      id: createdGame.body.id,
      firstPlayerProgress: {
        score: 0,
        player: {
          id: createdGame.body.firstPlayerProgress.player.id,
          login: 'OtherOl',
        },
        answers: [],
      },
      secondPlayerProgress: null,
      questions: null,
      status: 'PendingSecondPlayer',
      pairCreatedDate: expect.any(String),
      startGameDate: null,
      finishGameDate: null,
    });
    game1 = createdGame.body;

    const getGame = await request(app.getHttpServer())
      .get('/pair-game-quiz/pairs/my-current')
      .set('Authorization', 'bearer ' + accessToken1);
    expect(getGame.status).toBe(200);
    expect(getGame.body).toEqual({
      id: game1.id,
      firstPlayerProgress: {
        score: 0,
        player: {
          id: game1.firstPlayerProgress!.player.id,
          login: 'OtherOl',
        },
        answers: [],
      },
      secondPlayerProgress: null,
      questions: null,
      status: 'PendingSecondPlayer',
      pairCreatedDate: expect.any(String),
      startGameDate: null,
      finishGameDate: null,
    });
  });

  it("Shouldn't connect user1 to game, because he is in the game => 403 status", async () => {
    const game = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/connection')
      .set('Authorization', 'bearer ' + accessToken1);
    expect(game.status).toBe(403);
  });

  it('Should connect user2 to existing game and change status to active => 200 status', async () => {
    const existingGame = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/connection')
      .set('Authorization', 'bearer ' + accessToken2);
    expect(existingGame.status).toBe(200);
    expect(existingGame.body).toEqual({
      id: game1.id,
      firstPlayerProgress: {
        score: 0,
        player: {
          id: game1.firstPlayerProgress!.player.id,
          login: 'OtherOl',
        },
        answers: [],
      },
      secondPlayerProgress: {
        score: 0,
        player: {
          id: existingGame.body.secondPlayerProgress!.player.id,
          login: 'User2',
        },
        answers: [],
      },
      questions: questionsViewModel,
      status: 'Active',
      pairCreatedDate: expect.any(String),
      startGameDate: expect.any(String),
      finishGameDate: null,
    });
  });

  it("Shouldn't create/connect game, because user is in active game => 403 status", async () => {
    const game = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/connection')
      .set('Authorization', 'bearer ' + accessToken1);
    expect(game.status).toBe(403);
  });

  it("Shouldn't get game by id => 401 status", async () => {
    const game = await request(app.getHttpServer())
      .get(`/pair-game-quiz/pairs/${game1.id}`)
      .set('Authorization', 'bearer DASDSADSAD');
    expect(game.status).toBe(401);
  });

  it("Shouldn't get game by id => 403 status", async () => {
    const game = await request(app.getHttpServer())
      .get(`/pair-game-quiz/pairs/${game1.id}`)
      .set('Authorization', 'bearer ' + accessToken3);
    expect(game.status).toBe(403);
  });

  it("Shouldn't get game by id => 404 status", async () => {
    const game = await request(app.getHttpServer())
      .get(`/pair-game-quiz/pairs/a7fa3abf-722f-4321-86c7-49c4db4fa77c`)
      .set('Authorization', 'bearer ' + accessToken3);
    expect(game.status).toBe(404);
  });

  it("Shouldn't get game by id => 400 status", async () => {
    const game = await request(app.getHttpServer())
      .get('/pair-game-quiz/pairs/thisisfake')
      .set('Authorization', 'bearer ' + accessToken3);
    expect(game.status).toBe(400);
  });

  it('Should return game by id => 200 status', async () => {
    const game = await request(app.getHttpServer())
      .get(`/pair-game-quiz/pairs/${game1.id}`)
      .set('Authorization', 'bearer ' + accessToken1);
    expect(game.status).toBe(200);
    expect(game.body).toEqual({
      id: game1.id,
      firstPlayerProgress: {
        score: 0,
        player: {
          id: game1.firstPlayerProgress!.player.id,
          login: 'OtherOl',
        },
        answers: [],
      },
      secondPlayerProgress: {
        score: 0,
        player: {
          id: game.body.secondPlayerProgress!.player.id,
          login: 'User2',
        },
        answers: [],
      },
      questions: questionsViewModel,
      status: 'Active',
      pairCreatedDate: expect.any(String),
      startGameDate: expect.any(String),
      finishGameDate: null,
    });
  });

  it("Shouldn't send answer => 401 status", async () => {
    const sendAnswer = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .send({ answer: 'This is not answer' })
      .set('Authorization', 'bearer HOHOHHOBOMBOBM');
    expect(sendAnswer.status).toBe(401);
  });

  let user4: userModel;
  let accessToken4: string;
  it("Shouldn't send answer, because user is not inside active pair => 403 status", async () => {
    const newUser4 = await request(app.getHttpServer())
      .post('/sa/users')
      .send(userCreateModel('User4', '12345678', 'pilya@gmail.com'))
      .auth('admin', 'qwerty');
    expect(newUser4.status).toBe(201);
    user4 = newUser4.body;

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ loginOrEmail: user4.login, password: '12345678' });
    expect(login.status).toBe(200);
    accessToken4 = login.body.accessToken;

    const sendAnswer = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .send({ answer: 'Some answer' })
      .set('Authorization', 'bearer ' + accessToken4);
    expect(sendAnswer.status).toBe(403);
  });

  it('Should send right answers for 1-3 questions by firstPlayer and return it => 200 status', async () => {
    const sendAnswer = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .send({ answer: 'Yes' })
      .set('Authorization', 'bearer ' + accessToken1);
    expect(sendAnswer.status).toBe(200);
    expect(sendAnswer.body).toEqual({
      questionId: expect.any(String),
      answerStatus: 'Correct',
      addedAt: expect.any(String),
    });

    const sendAnswer2 = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .send({ answer: '100' })
      .set('Authorization', 'bearer ' + accessToken1);
    expect(sendAnswer2.status).toBe(200);
    expect(sendAnswer2.body).toEqual({
      questionId: expect.any(String),
      answerStatus: 'Correct',
      addedAt: expect.any(String),
    });

    const sendAnswer3 = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .send({ answer: '550 BYN' })
      .set('Authorization', 'bearer ' + accessToken1);
    expect(sendAnswer3.status).toBe(200);
    expect(sendAnswer3.body).toEqual({
      questionId: expect.any(String),
      answerStatus: 'Correct',
      addedAt: expect.any(String),
    });

    const game = await request(app.getHttpServer())
      .get(`/pair-game-quiz/pairs/${game1.id}`)
      .set('Authorization', 'bearer ' + accessToken1);
    expect(game.status).toBe(200);
    expect(game.body).toEqual({
      id: game1.id,
      firstPlayerProgress: {
        score: 3,
        player: {
          id: game1.firstPlayerProgress!.player.id,
          login: 'OtherOl',
        },
        answers: [
          {
            questionId: expect.any(String),
            answerStatus: 'Correct',
            addedAt: expect.any(String),
          },
          {
            questionId: expect.any(String),
            answerStatus: 'Correct',
            addedAt: expect.any(String),
          },
          {
            questionId: expect.any(String),
            answerStatus: 'Correct',
            addedAt: expect.any(String),
          },
        ],
      },
      secondPlayerProgress: {
        score: 0,
        player: {
          id: game.body.secondPlayerProgress!.player.id,
          login: 'User2',
        },
        answers: [],
      },
      questions: questionsViewModel,
      status: 'Active',
      pairCreatedDate: expect.any(String),
      startGameDate: expect.any(String),
      finishGameDate: null,
    });
  });

  it('Should send incorrect/correct answers for 1-5 questions by secondPlayer + bonus and return it => 200 status', async () => {
    for (let i = 0; i < 5; i++) {
      const sendAnswer = await request(app.getHttpServer())
        .post('/pair-game-quiz/pairs/my-current/answers')
        .send({ answer: 'Yes' })
        .set('Authorization', 'bearer ' + accessToken2);
      expect(sendAnswer.status).toBe(200);
      expect(sendAnswer.body).toEqual({
        questionId: expect.any(String),
        answerStatus: expect.any(String),
        addedAt: expect.any(String),
      });
    }
    const game = await request(app.getHttpServer())
      .get(`/pair-game-quiz/pairs/${game1.id}`)
      .set('Authorization', 'bearer ' + accessToken1);
    expect(game.status).toBe(200);
    expect(game.body).toEqual({
      id: game1.id,
      firstPlayerProgress: {
        score: 3,
        player: {
          id: game1.firstPlayerProgress!.player.id,
          login: 'OtherOl',
        },
        answers: [
          {
            questionId: expect.any(String),
            answerStatus: 'Correct',
            addedAt: expect.any(String),
          },
          {
            questionId: expect.any(String),
            answerStatus: 'Correct',
            addedAt: expect.any(String),
          },
          {
            questionId: expect.any(String),
            answerStatus: 'Correct',
            addedAt: expect.any(String),
          },
        ],
      },
      secondPlayerProgress: {
        score: 1,
        player: {
          id: game.body.secondPlayerProgress!.player.id,
          login: 'User2',
        },
        answers: [
          {
            questionId: expect.any(String),
            answerStatus: 'Correct',
            addedAt: expect.any(String),
          },
          {
            questionId: expect.any(String),
            answerStatus: 'Incorrect',
            addedAt: expect.any(String),
          },
          {
            questionId: expect.any(String),
            answerStatus: 'Incorrect',
            addedAt: expect.any(String),
          },
          {
            questionId: expect.any(String),
            answerStatus: 'Incorrect',
            addedAt: expect.any(String),
          },
          {
            questionId: expect.any(String),
            answerStatus: 'Incorrect',
            addedAt: expect.any(String),
          },
        ],
      },
      questions: questionsViewModel,
      status: 'Active',
      pairCreatedDate: expect.any(String),
      startGameDate: expect.any(String),
      finishGameDate: null,
    });
  });

  it("Shouldn't send answer by secondPlayer, because answered all questions => 403 status", async () => {
    const sendAnswer = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .send({ answer: '100' })
      .set('Authorization', 'bearer ' + accessToken2);
    expect(sendAnswer.status).toBe(403);
  });

  // let finishedGame1: PairQuizGame;
  it('Should answer lasts questions by user1 and game should be finished => 200 status', async () => {
    for (let i = 0; i < 2; i++) {
      const sendAnswer = await request(app.getHttpServer())
        .post('/pair-game-quiz/pairs/my-current/answers')
        .send({ answer: 'Metal' })
        .set('Authorization', 'bearer ' + accessToken1);
      expect(sendAnswer.status).toBe(200);
    }
    const game = await request(app.getHttpServer())
      .get(`/pair-game-quiz/pairs/${game1.id}`)
      .set('Authorization', 'bearer ' + accessToken1);
    expect(game.status).toBe(200);
    // finishedGame1 = game.body;
    expect(game.body).toEqual({
      id: game1.id,
      firstPlayerProgress: {
        score: 4,
        player: {
          id: game1.firstPlayerProgress!.player.id,
          login: 'OtherOl',
        },
        answers: [
          {
            questionId: expect.any(String),
            answerStatus: 'Correct',
            addedAt: expect.any(String),
          },
          {
            questionId: expect.any(String),
            answerStatus: 'Correct',
            addedAt: expect.any(String),
          },
          {
            questionId: expect.any(String),
            answerStatus: 'Correct',
            addedAt: expect.any(String),
          },
          {
            questionId: expect.any(String),
            answerStatus: 'Correct',
            addedAt: expect.any(String),
          },
          {
            questionId: expect.any(String),
            answerStatus: 'Incorrect',
            addedAt: expect.any(String),
          },
        ],
      },
      secondPlayerProgress: {
        score: 2,
        player: {
          id: game.body.secondPlayerProgress!.player.id,
          login: 'User2',
        },
        answers: [
          {
            questionId: expect.any(String),
            answerStatus: 'Correct',
            addedAt: expect.any(String),
          },
          {
            questionId: expect.any(String),
            answerStatus: 'Incorrect',
            addedAt: expect.any(String),
          },
          {
            questionId: expect.any(String),
            answerStatus: 'Incorrect',
            addedAt: expect.any(String),
          },
          {
            questionId: expect.any(String),
            answerStatus: 'Incorrect',
            addedAt: expect.any(String),
          },
          {
            questionId: expect.any(String),
            answerStatus: 'Incorrect',
            addedAt: expect.any(String),
          },
        ],
      },
      questions: questionsViewModel,
      status: 'Finished',
      pairCreatedDate: expect.any(String),
      startGameDate: expect.any(String),
      finishGameDate: expect.any(String),
    });
  });

  it("Shouldn't return finished game OtherOl + User2 => 404 status", async () => {
    const game = await request(app.getHttpServer())
      .get('/pair-game-quiz/pairs/my-current')
      .set('Authorization', 'bearer ' + accessToken1);
    expect(game.status).toBe(404);

    const game2 = await request(app.getHttpServer())
      .get('/pair-game-quiz/pairs/my-current')
      .set('Authorization', 'bearer ' + accessToken2);
    expect(game2.status).toBe(404);
  });

  for (let i = 0; i < 3; i++) {
    let game2: GameViewModel;
    it('Should start another game by User2 and return it => 200 status', async () => {
      const createdGame = await request(app.getHttpServer())
        .post('/pair-game-quiz/pairs/connection')
        .set('Authorization', 'bearer ' + accessToken2);
      expect(createdGame.status).toBe(200);
      game2 = createdGame.body;
      expect(createdGame.body).toEqual({
        id: createdGame.body.id,
        firstPlayerProgress: {
          score: 0,
          player: {
            id: createdGame.body.firstPlayerProgress.player.id,
            login: 'User2',
          },
          answers: [],
        },
        secondPlayerProgress: null,
        questions: null,
        status: 'PendingSecondPlayer',
        pairCreatedDate: expect.any(String),
        startGameDate: null,
        finishGameDate: null,
      });

      const getGame = await request(app.getHttpServer())
        .get('/pair-game-quiz/pairs/my-current')
        .set('Authorization', 'bearer ' + accessToken2);
      expect(getGame.status).toBe(200);
      expect(getGame.body).toEqual({
        id: game2.id,
        firstPlayerProgress: {
          score: 0,
          player: {
            id: createdGame.body.firstPlayerProgress.player.id,
            login: 'User2',
          },
          answers: [],
        },
        secondPlayerProgress: null,
        questions: null,
        status: 'PendingSecondPlayer',
        pairCreatedDate: expect.any(String),
        startGameDate: null,
        finishGameDate: null,
      });
    });

    it('Should connect OtherOl to game with game2 with User2 and return it => 200 status', async () => {
      const createdGame = await request(app.getHttpServer())
        .post('/pair-game-quiz/pairs/connection')
        .set('Authorization', 'bearer ' + accessToken1);
      expect(createdGame.status).toBe(200);
      expect(createdGame.body).toEqual({
        id: game2.id,
        firstPlayerProgress: {
          score: 0,
          player: {
            id: createdGame.body.firstPlayerProgress.player.id,
            login: 'User2',
          },
          answers: [],
        },
        secondPlayerProgress: {
          score: 0,
          player: {
            id: createdGame.body.secondPlayerProgress.player.id,
            login: 'OtherOl',
          },
          answers: [],
        },
        questions: questionsViewModel,
        status: 'Active',
        pairCreatedDate: expect.any(String),
        startGameDate: expect.any(String),
        finishGameDate: null,
      });

      const getGame = await request(app.getHttpServer())
        .get('/pair-game-quiz/pairs/my-current')
        .set('Authorization', 'bearer ' + accessToken1);
      expect(getGame.status).toBe(200);
      expect(getGame.body).toEqual({
        id: game2.id,
        firstPlayerProgress: {
          score: 0,
          player: {
            id: createdGame.body.firstPlayerProgress.player.id,
            login: 'User2',
          },
          answers: [],
        },
        secondPlayerProgress: {
          score: 0,
          player: {
            id: createdGame.body.secondPlayerProgress.player.id,
            login: 'OtherOl',
          },
          answers: [],
        },
        questions: questionsViewModel,
        status: 'Active',
        pairCreatedDate: expect.any(String),
        startGameDate: expect.any(String),
        finishGameDate: null,
      });
    });

    it('Should send answers by User2 and OtherOl and get unfinished game', async () => {
      const answerFirstPlayer1 = await request(app.getHttpServer())
        .post('/pair-game-quiz/pairs/my-current/answers')
        .send({ answer: 'Yes' })
        .set('Authorization', 'bearer ' + accessToken2);
      expect(answerFirstPlayer1.status).toBe(200);
      expect(answerFirstPlayer1.body).toEqual({
        questionId: expect.any(String),
        answerStatus: 'Correct',
        addedAt: expect.any(String),
      });

      const answerSecondPlayer1 = await request(app.getHttpServer())
        .post('/pair-game-quiz/pairs/my-current/answers')
        .send({ answer: 'Incorrect' })
        .set('Authorization', 'bearer ' + accessToken1);
      expect(answerSecondPlayer1.status).toBe(200);
      expect(answerSecondPlayer1.body).toEqual({
        questionId: expect.any(String),
        answerStatus: 'Incorrect',
        addedAt: expect.any(String),
      });

      const answerSecondPlayer2 = await request(app.getHttpServer())
        .post('/pair-game-quiz/pairs/my-current/answers')
        .send({ answer: '100' })
        .set('Authorization', 'bearer ' + accessToken1);
      expect(answerSecondPlayer2.status).toBe(200);
      expect(answerSecondPlayer2.body).toEqual({
        questionId: expect.any(String),
        answerStatus: 'Correct',
        addedAt: expect.any(String),
      });

      const getGameByFirstPlayer = await request(app.getHttpServer())
        .get('/pair-game-quiz/pairs/my-current')
        .set('Authorization', 'bearer ' + accessToken2);
      expect(getGameByFirstPlayer.status).toBe(200);
      expect(getGameByFirstPlayer.body).toEqual({
        id: game2.id,
        firstPlayerProgress: {
          score: 1,
          player: {
            id: getGameByFirstPlayer.body.firstPlayerProgress.player.id,
            login: 'User2',
          },
          answers: [
            {
              questionId: expect.any(String),
              answerStatus: 'Correct',
              addedAt: expect.any(String),
            },
          ],
        },
        secondPlayerProgress: {
          score: 1,
          player: {
            id: getGameByFirstPlayer.body.secondPlayerProgress.player.id,
            login: 'OtherOl',
          },
          answers: [
            {
              questionId: expect.any(String),
              answerStatus: 'Incorrect',
              addedAt: expect.any(String),
            },
            {
              questionId: expect.any(String),
              answerStatus: 'Correct',
              addedAt: expect.any(String),
            },
          ],
        },
        questions: questionsViewModel,
        status: 'Active',
        pairCreatedDate: expect.any(String),
        startGameDate: expect.any(String),
        finishGameDate: null,
      });

      const getGameBySecondPlayer = await request(app.getHttpServer())
        .get('/pair-game-quiz/pairs/my-current')
        .set('Authorization', 'bearer ' + accessToken1);
      expect(getGameBySecondPlayer.status).toBe(200);
      expect(getGameBySecondPlayer.body).toEqual({
        id: game2.id,
        firstPlayerProgress: {
          score: 1,
          player: {
            id: user2.id,
            login: 'User2',
          },
          answers: [
            {
              questionId: expect.any(String),
              answerStatus: 'Correct',
              addedAt: expect.any(String),
            },
          ],
        },
        secondPlayerProgress: {
          score: 1,
          player: {
            id: user1.id,
            login: 'OtherOl',
          },
          answers: [
            {
              questionId: expect.any(String),
              answerStatus: 'Incorrect',
              addedAt: expect.any(String),
            },
            {
              questionId: expect.any(String),
              answerStatus: 'Correct',
              addedAt: expect.any(String),
            },
          ],
        },
        questions: questionsViewModel,
        status: 'Active',
        pairCreatedDate: expect.any(String),
        startGameDate: expect.any(String),
        finishGameDate: null,
      });
    });

    it('Should answer leftover questions by User2 and OtherOl => 200 status', async () => {
      const answerFirstPlayer2 = await request(app.getHttpServer())
        .post('/pair-game-quiz/pairs/my-current/answers')
        .send({ answer: '100' })
        .set('Authorization', 'bearer ' + accessToken2);
      expect(answerFirstPlayer2.status).toBe(200);
      expect(answerFirstPlayer2.body).toEqual({
        questionId: expect.any(String),
        answerStatus: 'Correct',
        addedAt: expect.any(String),
      });

      const answerFirstPlayer3 = await request(app.getHttpServer())
        .post('/pair-game-quiz/pairs/my-current/answers')
        .send({ answer: '20000 RUB' })
        .set('Authorization', 'bearer ' + accessToken2);
      expect(answerFirstPlayer3.status).toBe(200);
      expect(answerFirstPlayer3.body).toEqual({
        questionId: expect.any(String),
        answerStatus: 'Correct',
        addedAt: expect.any(String),
      });

      const answerFirstPlayer4 = await request(app.getHttpServer())
        .post('/pair-game-quiz/pairs/my-current/answers')
        .send({ answer: 'Metal' })
        .set('Authorization', 'bearer ' + accessToken2);
      expect(answerFirstPlayer4.status).toBe(200);
      expect(answerFirstPlayer4.body).toEqual({
        questionId: expect.any(String),
        answerStatus: 'Correct',
        addedAt: expect.any(String),
      });

      const answerFirstPlayer5 = await request(app.getHttpServer())
        .post('/pair-game-quiz/pairs/my-current/answers')
        .send({ answer: 'Incorrect' })
        .set('Authorization', 'bearer ' + accessToken2);
      expect(answerFirstPlayer5.status).toBe(200);
      expect(answerFirstPlayer5.body).toEqual({
        questionId: expect.any(String),
        answerStatus: 'Incorrect',
        addedAt: expect.any(String),
      });

      const answerSecondPlayer3 = await request(app.getHttpServer())
        .post('/pair-game-quiz/pairs/my-current/answers')
        .send({ answer: '550 BYN' })
        .set('Authorization', 'bearer ' + accessToken1);
      expect(answerSecondPlayer3.status).toBe(200);
      expect(answerSecondPlayer3.body).toEqual({
        questionId: expect.any(String),
        answerStatus: 'Correct',
        addedAt: expect.any(String),
      });

      const answerSecondPlayer4 = await request(app.getHttpServer())
        .post('/pair-game-quiz/pairs/my-current/answers')
        .send({ answer: 'Rock' })
        .set('Authorization', 'bearer ' + accessToken1);
      expect(answerSecondPlayer4.status).toBe(200);
      expect(answerSecondPlayer4.body).toEqual({
        questionId: expect.any(String),
        answerStatus: 'Correct',
        addedAt: expect.any(String),
      });

      const answerSecondPlayer5 = await request(app.getHttpServer())
        .post('/pair-game-quiz/pairs/my-current/answers')
        .send({ answer: 'Of course' })
        .set('Authorization', 'bearer ' + accessToken1);
      expect(answerSecondPlayer5.status).toBe(200);
      expect(answerSecondPlayer5.body).toEqual({
        questionId: expect.any(String),
        answerStatus: 'Correct',
        addedAt: expect.any(String),
      });

      const unfinishedGame1 = await request(app.getHttpServer())
        .get('/pair-game-quiz/pairs/my-current')
        .set('Authorization', 'bearer ' + accessToken1);
      expect(unfinishedGame1.status).toBe(404);

      const unfinishedGame2 = await request(app.getHttpServer())
        .get('/pair-game-quiz/pairs/my-current')
        .set('Authorization', 'bearer ' + accessToken2);
      expect(unfinishedGame2.status).toBe(404);

      const getGameById = await request(app.getHttpServer())
        .get(`/pair-game-quiz/pairs/${game2.id}`)
        .set('Authorization', 'bearer ' + accessToken2);
      expect(getGameById.status).toBe(200);
      expect(getGameById.body).toEqual({
        id: game2.id,
        firstPlayerProgress: {
          score: 5,
          player: {
            id: getGameById.body.firstPlayerProgress.player.id,
            login: 'User2',
          },
          answers: [
            {
              questionId: expect.any(String),
              answerStatus: 'Correct',
              addedAt: expect.any(String),
            },
            {
              questionId: expect.any(String),
              answerStatus: 'Correct',
              addedAt: expect.any(String),
            },
            {
              questionId: expect.any(String),
              answerStatus: 'Correct',
              addedAt: expect.any(String),
            },
            {
              questionId: expect.any(String),
              answerStatus: 'Correct',
              addedAt: expect.any(String),
            },
            {
              questionId: expect.any(String),
              answerStatus: 'Incorrect',
              addedAt: expect.any(String),
            },
          ],
        },
        secondPlayerProgress: {
          score: 4,
          player: {
            id: getGameById.body.secondPlayerProgress.player.id,
            login: 'OtherOl',
          },
          answers: [
            {
              questionId: expect.any(String),
              answerStatus: 'Incorrect',
              addedAt: expect.any(String),
            },
            {
              questionId: expect.any(String),
              answerStatus: 'Correct',
              addedAt: expect.any(String),
            },
            {
              questionId: expect.any(String),
              answerStatus: 'Correct',
              addedAt: expect.any(String),
            },
            {
              questionId: expect.any(String),
              answerStatus: 'Correct',
              addedAt: expect.any(String),
            },
            {
              questionId: expect.any(String),
              answerStatus: 'Correct',
              addedAt: expect.any(String),
            },
          ],
        },
        questions: questionsViewModel,
        status: 'Finished',
        pairCreatedDate: expect.any(String),
        startGameDate: expect.any(String),
        finishGameDate: expect.any(String),
      });
    });
  }

  it('Should return user statistic => 200 status', async () => {
    const statistic = await request(app.getHttpServer())
      .get('/pair-game-quiz/users/my-statistic')
      .set('Authorization', 'bearer ' + accessToken1);
    expect(statistic.status).toBe(200);
  });
});
