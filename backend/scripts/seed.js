require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Post = require('../models/Post');
const Thread = require('../models/Thread');
const Reply = require('../models/Reply');
const Counselor = require('../models/Counselor');
const Booking = require('../models/Booking');
const Report = require('../models/Report');

const SEED_PASSWORD = 'password123';

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  await Promise.all([
    User.deleteMany({}),
    Post.deleteMany({}),
    Thread.deleteMany({}),
    Reply.deleteMany({}),
    Counselor.deleteMany({}),
    Booking.deleteMany({}),
    Report.deleteMany({}),
  ]);
  console.log('Cleared existing collections');

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  const [admin, moderator, alice, ben, casey] = await User.create([
    { pseudonym: 'admin_sage', passwordHash, role: 'admin' },
    { pseudonym: 'mod_river', passwordHash, role: 'moderator' },
    { pseudonym: 'quiet_alice', passwordHash, role: 'user' },
    { pseudonym: 'steady_ben', passwordHash, role: 'user' },
    { pseudonym: 'hopeful_casey', passwordHash, role: 'user' },
  ]);
  console.log('Seeded users');

  const posts = await Post.create([
    {
      author: alice._id,
      category: 'academic',
      content: 'Finals week is crushing me. Anyone else feel like they are behind on everything?',
    },
    {
      author: ben._id,
      category: 'financial',
      content: 'Just found out I need to cover rent and tuition this month with barely any savings left.',
    },
    {
      author: casey._id,
      category: 'family',
      content: 'My parents still do not know I dropped a class. Dreading the conversation.',
    },
    {
      author: alice._id,
      category: 'relationships',
      content: 'Broke up with my partner of two years last week. Still processing it.',
    },
    {
      author: ben._id,
      category: 'addiction',
      content: 'Six months sober today. Some days are still really hard but I am proud of how far I have come.',
    },
    {
      // flagged: true simulates what createPost's keyword check would set for
      // content like this — the Post model's pre-save hook then guarantees
      // status becomes under_review, landing it in the moderation queue.
      author: casey._id,
      category: 'mental_health',
      content: 'Lately I keep thinking about wanting to die and I do not know who to talk to about it.',
      flagged: true,
    },
  ]);
  console.log(`Seeded ${posts.length} posts (1 auto-flagged into the moderation queue)`);

  const [thread1, thread2, thread3] = await Thread.create([
    {
      author: alice._id,
      category: 'academic',
      title: 'How do you deal with burnout during exam season?',
      body: 'I have three exams this week and I am completely fried. What actually helps you reset?',
      upvotes: 4,
    },
    {
      author: ben._id,
      category: 'addiction',
      title: 'Celebrating small sober milestones — share yours',
      body: 'Hit 6 months today. Would love to hear what has kept everyone else going.',
      upvotes: 9,
    },
    {
      author: casey._id,
      category: 'relationships',
      title: 'Is it normal to still miss an ex you know was bad for you?',
      body: 'It has been a month and I still catch myself wanting to text them. Anyone else been through this?',
      upvotes: 2,
    },
  ]);
  console.log('Seeded threads');

  await Reply.create([
    { thread: thread1._id, author: ben._id, body: 'Short walks between study blocks saved me last semester.', upvotes: 3 },
    { thread: thread1._id, author: casey._id, body: 'Second this — even 10 minutes outside helps a lot.', upvotes: 1 },
    { thread: thread2._id, author: casey._id, body: 'Congrats on 6 months! That is huge.', upvotes: 5 },
    {
      thread: thread3._id,
      author: ben._id,
      body: 'This is spam, ignore, click here for free stuff',
      upvotes: 0,
      flagged: true,
    },
  ]);
  console.log('Seeded replies (1 pre-flagged for the moderation demo)');

  const [drPatel, drOkafor, drLindqvist, drPending] = await Counselor.create([
    {
      name: 'Dr. Meera Patel',
      email: 'meera.patel@example.com',
      passwordHash,
      specialties: ['mental_health', 'academic'],
      credentials: 'Licensed Clinical Psychologist, 10+ years',
      verified: true,
    },
    {
      name: 'Dr. Tunde Okafor',
      email: 'tunde.okafor@example.com',
      passwordHash,
      specialties: ['addiction', 'family'],
      credentials: 'Licensed Addiction Counselor',
      verified: true,
    },
    {
      name: 'Dr. Elin Lindqvist',
      email: 'elin.lindqvist@example.com',
      passwordHash,
      specialties: ['relationships', 'financial'],
      credentials: 'Licensed Marriage & Family Therapist',
      verified: true,
    },
    {
      name: 'Dr. Sam Whitfield',
      email: 'sam.whitfield@example.com',
      passwordHash,
      specialties: ['mental_health'],
      credentials: 'Licensed Counselor, pending admin verification',
      verified: false,
    },
  ]);
  console.log('Seeded counselors (1 left unverified for the verification demo)');

  await Booking.create([
    {
      user: alice._id,
      counselor: drPatel._id,
      requestedTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'pending',
      notes: 'Would prefer an evening slot if possible.',
    },
    {
      user: ben._id,
      counselor: drOkafor._id,
      requestedTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: 'confirmed',
    },
    {
      user: casey._id,
      counselor: drLindqvist._id,
      requestedTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      status: 'pending',
      notes: 'First session, a bit nervous.',
    },
  ]);
  console.log('Seeded bookings');

  await Report.create([
    {
      reporter: alice._id,
      targetType: 'reply',
      targetId: new mongoose.Types.ObjectId(),
      reason: 'This reply looks like spam / unrelated advertising.',
    },
    {
      reporter: ben._id,
      targetType: 'post',
      targetId: posts[5]._id,
      reason: 'Content suggests the poster may be at risk — flagging for review.',
    },
    {
      reporter: casey._id,
      targetType: 'thread',
      targetId: thread3._id,
      reason: 'Off-topic and unkind comments in this thread.',
      status: 'resolved',
      resolvedBy: moderator._id,
      resolvedAt: new Date(),
    },
  ]);
  console.log('Seeded reports (1 already resolved)');

  console.log('\nSeed complete. Login credentials for every seeded account:');
  console.log(`  Password (all accounts): ${SEED_PASSWORD}`);
  console.log('  Admin:      pseudonym=admin_sage');
  console.log('  Moderator:  pseudonym=mod_river');
  console.log('  Users:      pseudonym=quiet_alice | steady_ben | hopeful_casey');
  console.log('  Counselors (email login): meera.patel@example.com, tunde.okafor@example.com,');
  console.log('              elin.lindqvist@example.com (verified), sam.whitfield@example.com (unverified)');
  console.log(`\n  Unverified counselor id for the admin verify demo: ${drPending._id}`);

  await mongoose.disconnect();
  console.log('\nDisconnected. Done.');
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
