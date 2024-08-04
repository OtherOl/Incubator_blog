// import request from 'supertest';
// import { INestApplication } from '@nestjs/common';
// import { Test, TestingModule } from '@nestjs/testing';
// import { AppModule } from '../src/app.module';
// import { appSettings } from '../src/settings';
//
// describe('Sessions', () => {
//   let app: INestApplication;
//   beforeAll(async () => {
//     const module: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
//     app = module.createNestApplication();
//
//     appSettings(app);
//
//     await app.init();
//     const db = await request(app.getHttpServer()).delete('/testing/all-data').send();
//     expect(db.status).toBe(204);
//   });
//
//   afterAll(async () => {
//     await app.close();
//   });
//
//   it('should create new user => status 201', async () => {
//     const newUser = {
//       login: 'OtherOl',
//       password: '12345678',
//       email: 'pilyak003@gmail.com',
//     };
//     const createdUser = await request(app.getHttpServer())
//       .post('/sa/users')
//       .send(newUser)
//       .auth('admin', 'qwerty');
//
//     expect(createdUser.status).toBe(201);
//     expect(createdUser.body).toEqual({
//       id: expect.any(String),
//       login: newUser.login,
//       email: newUser.email,
//       createdAt: expect.any(String),
//     });
//
//     const login = await request(app.getHttpServer()).post('/auth/login').send({
//       loginOrEmail: newUser.login,
//       password: newUser.password,
//     });
//
//     expect(login.status).toBe(200);
//     expect(login.body).toEqual({
//       accessToken: expect.any(String),
//     });
//
//     const refreshToken = login.headers['set-cookie'][0];
//     const getAllDevices = await request(app.getHttpServer())
//       .get('/security/devices')
//       .set('Cookie', refreshToken);
//
//     expect(getAllDevices.status).toBe(200);
//     expect(getAllDevices.body).toEqual([
//       {
//         ip: expect.any(String),
//         title: expect.any(String),
//         lastActiveDate: expect.any(String),
//         deviceId: expect.any(String),
//       },
//     ]);
//   });

// it('should login user 4 times from different browsers, then get device list => 200 status', async () => {
//   const newUser = {
//     login: 'user1',
//     password: '12345678',
//     email: 'pilyak003@gmail.com',
//   };
//   const createdUser = await request(app.getHttpServer())
//     .post('/users')
//     .send(newUser)
//     .auth('admin', 'qwerty');
//
//   expect(createdUser.status).toBe(201);
//
//   const login1 = await request(app.getHttpServer())
//     .post('/auth/login')
//     .send({
//       loginOrEmail: newUser.login,
//       password: newUser.password,
//     })
//     .set('User-agent', 'Google');
//
//   expect(login1.status).toBe(200);
//
//   const login2 = await request(app.getHttpServer())
//     .post('/auth/login')
//     .send({
//       loginOrEmail: newUser.login,
//       password: newUser.password,
//     })
//     .set('User-agent', 'Firefox');
//
//   expect(login2.status).toBe(200);
//
//   const login3 = await request(app.getHttpServer())
//     .post('/auth/login')
//     .send({
//       loginOrEmail: newUser.login,
//       password: newUser.password,
//     })
//     .set('User-agent', 'Yandex');
//
//   expect(login3.status).toBe(200);
//
//   const login4 = await request(app.getHttpServer())
//     .post('/auth/login')
//     .send({
//       loginOrEmail: newUser.login,
//       password: newUser.password,
//     })
//     .set('User-agent', 'Opera');
//
//   expect(login4.status).toBe(200);
//
//   const refreshToken = login4.headers['set-cookie'][0];
//   const getAllDevices = await request(app.getHttpServer())
//     .get('/security/devices')
//     .set('Cookie', refreshToken);
//
//   expect(getAllDevices.status).toBe(200);
//   expect(getAllDevices.body).toEqual([
//     {
//       ip: expect.any(String),
//       title: expect.any(String),
//       lastActiveDate: expect.any(String),
//       deviceId: expect.any(String),
//     },
//     {
//       ip: expect.any(String),
//       title: expect.any(String),
//       lastActiveDate: expect.any(String),
//       deviceId: expect.any(String),
//     },
//     {
//       ip: expect.any(String),
//       title: expect.any(String),
//       lastActiveDate: expect.any(String),
//       deviceId: expect.any(String),
//     },
//     {
//       ip: expect.any(String),
//       title: expect.any(String),
//       lastActiveDate: expect.any(String),
//       deviceId: expect.any(String),
//     },
//   ]);
// });
//
//   it('should delete session by deviceId', async () => {
//     const defaultUser = {
//       login: 'OtherOl',
//       password: '12345678',
//       email: 'pilyak003@gmail.com',
//     };
//     const createdUser = await request(app.getHttpServer())
//       .post('/sa/users')
//       .send(defaultUser)
//       .auth('admin', 'qwerty');
//
//     expect(createdUser.status).toBe(201);
//
//     const login = await request(app.getHttpServer()).post('/auth/login').send({
//       loginOrEmail: defaultUser.login,
//       password: defaultUser.password,
//     });
//
//     expect(login.status).toBe(200);
//
//     const refreshToken = login.headers['set-cookie'][0];
//     const getAllDevices = await request(app.getHttpServer())
//       .get('/security/devices')
//       .set('Cookie', refreshToken);
//
//     expect(getAllDevices.status).toBe(200);
//
//     const deletedSession = await request(app.getHttpServer())
//       .delete(`/security/devices/${getAllDevices.body[0].deviceId}`)
//       .set('Cookie', refreshToken);
//
//     expect(deletedSession.status).toBe(204);
//   });
// });
