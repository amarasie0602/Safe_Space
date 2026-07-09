const request = require('supertest');
const { connectTestDb, clearTestDb, disconnectTestDb } = require('./testDb');

let app;

const registerUser = async (pseudonym) => {
  const res = await request(app)
    .post('/auth/register')
    .send({ pseudonym, password: 'password123' });
  return res.body.token;
};

beforeAll(async () => {
  await connectTestDb();
  app = require('../server');
});

afterEach(clearTestDb);
afterAll(disconnectTestDb);

describe('post safety-critical flagging', () => {
  // Safety-critical: this is the only gate before content reaches the public
  // feed. If this test starts failing, do not weaken it to make it pass —
  // the risk-keyword check in postController.js is what it's guarding.
  test('a post containing a risk keyword is flagged and hidden from the public feed', async () => {
    const token = await registerUser('test_riskcheck');

    const createRes = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ category: 'mental_health', content: 'I keep thinking I want to die.' });

    expect(createRes.status).toBe(201);
    expect(createRes.body.flagged).toBe(true);
    expect(createRes.body.status).toBe('under_review');

    const feedRes = await request(app).get('/posts');
    const ids = feedRes.body.posts.map((post) => post._id);
    expect(ids).not.toContain(createRes.body._id);
  });

  test('a normal post is not flagged and does appear in the public feed', async () => {
    const token = await registerUser('test_normalpost');

    const createRes = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ category: 'gratitude', content: 'Small win: I finished a task I had been avoiding.' });

    expect(createRes.status).toBe(201);
    expect(createRes.body.flagged).toBe(false);
    expect(createRes.body.status).toBe('visible');

    const feedRes = await request(app).get('/posts');
    const ids = feedRes.body.posts.map((post) => post._id);
    expect(ids).toContain(createRes.body._id);
  });

  test('creating a post without a token is rejected', async () => {
    const res = await request(app)
      .post('/posts')
      .send({ category: 'mental_health', content: 'No token attached.' });

    expect(res.status).toBe(401);
  });
});
