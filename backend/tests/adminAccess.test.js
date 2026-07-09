const request = require('supertest');
const { connectTestDb, clearTestDb, disconnectTestDb } = require('./testDb');
const User = require('../models/User');

let app;

beforeAll(async () => {
  await connectTestDb();
  app = require('../server');
});

afterEach(clearTestDb);
afterAll(disconnectTestDb);

const registerAndLogin = async (pseudonym) => {
  const res = await request(app)
    .post('/auth/register')
    .send({ pseudonym, password: 'password123' });
  return res.body.token;
};

// A JWT is stateless — it carries the role it was issued with, so promoting
// a user to admin in the DB does nothing until they get a fresh token.
const login = async (pseudonym) => {
  const res = await request(app)
    .post('/auth/login')
    .send({ pseudonym, password: 'password123' });
  return res.body.token;
};

describe('admin route protection', () => {
  // Safety-critical: the moderation queue and safety analytics must never be
  // reachable by an unauthenticated request or a non-admin account.
  test('admin analytics rejects a request with no token', async () => {
    const res = await request(app).get('/admin/analytics');
    expect(res.status).toBe(401);
  });

  test('admin analytics rejects a regular user token', async () => {
    const token = await registerAndLogin('test_regularuser');
    const res = await request(app).get('/admin/analytics').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  test('admin analytics succeeds for an admin token', async () => {
    await registerAndLogin('test_adminuser');
    await User.updateOne({ pseudonym: 'test_adminuser' }, { role: 'admin' });
    const token = await login('test_adminuser');

    const res = await request(app).get('/admin/analytics').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('postsByCategory');
  });

  test('admin posts queue rejects a moderator-less user but the flagged post it protects still lands there', async () => {
    const userToken = await registerAndLogin('test_flagauthor');
    await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ category: 'mental_health', content: 'I want to end my life.' });

    const rejected = await request(app)
      .get('/admin/posts')
      .set('Authorization', `Bearer ${userToken}`);
    expect(rejected.status).toBe(403);

    await registerAndLogin('test_moderatoradmin');
    await User.updateOne({ pseudonym: 'test_moderatoradmin' }, { role: 'admin' });
    const adminToken = await login('test_moderatoradmin');

    const adminView = await request(app)
      .get('/admin/posts')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(adminView.status).toBe(200);
    expect(adminView.body.some((post) => post.flagged)).toBe(true);
  });
});
