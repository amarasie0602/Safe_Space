const request = require('supertest');
const { connectTestDb, clearTestDb, disconnectTestDb } = require('./testDb');

let app;

beforeAll(async () => {
  await connectTestDb();
  app = require('../server');
});

afterEach(clearTestDb);
afterAll(disconnectTestDb);

describe('auth', () => {
  test('register creates a user and returns a one-time recovery code', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ pseudonym: 'test_alice', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.pseudonym).toBe('test_alice');
    expect(res.body.recoveryCode).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  });

  test('register rejects a duplicate pseudonym', async () => {
    await request(app).post('/auth/register').send({ pseudonym: 'test_bob', password: 'password123' });

    const res = await request(app)
      .post('/auth/register')
      .send({ pseudonym: 'test_bob', password: 'somethingelse' });

    expect(res.status).toBe(409);
  });

  test('login fails with the wrong password', async () => {
    await request(app).post('/auth/register').send({ pseudonym: 'test_casey', password: 'password123' });

    const res = await request(app)
      .post('/auth/login')
      .send({ pseudonym: 'test_casey', password: 'wrong-password' });

    expect(res.status).toBe(401);
  });

  test('login succeeds with the right password', async () => {
    await request(app).post('/auth/register').send({ pseudonym: 'test_dee', password: 'password123' });

    const res = await request(app)
      .post('/auth/login')
      .send({ pseudonym: 'test_dee', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
  });

  test('reset-password rejects an incorrect recovery code', async () => {
    await request(app).post('/auth/register').send({ pseudonym: 'test_erin', password: 'password123' });

    const res = await request(app).post('/auth/reset-password').send({
      pseudonym: 'test_erin',
      recoveryCode: 'WRONG-CODE-0000',
      newPassword: 'newpassword123',
    });

    expect(res.status).toBe(401);
  });

  test('reset-password succeeds with the correct recovery code and rotates it', async () => {
    const registerRes = await request(app)
      .post('/auth/register')
      .send({ pseudonym: 'test_finn', password: 'password123' });
    const { recoveryCode } = registerRes.body;

    const resetRes = await request(app).post('/auth/reset-password').send({
      pseudonym: 'test_finn',
      recoveryCode,
      newPassword: 'newpassword123',
    });

    expect(resetRes.status).toBe(200);
    expect(resetRes.body.recoveryCode).not.toBe(recoveryCode);

    const oldPasswordLogin = await request(app)
      .post('/auth/login')
      .send({ pseudonym: 'test_finn', password: 'password123' });
    expect(oldPasswordLogin.status).toBe(401);

    const newPasswordLogin = await request(app)
      .post('/auth/login')
      .send({ pseudonym: 'test_finn', password: 'newpassword123' });
    expect(newPasswordLogin.status).toBe(200);

    // The old code must no longer work after rotation.
    const replayRes = await request(app).post('/auth/reset-password').send({
      pseudonym: 'test_finn',
      recoveryCode,
      newPassword: 'anotherpassword123',
    });
    expect(replayRes.status).toBe(401);
  });
});
