require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Post = require('../models/Post');
const Thread = require('../models/Thread');
const Reply = require('../models/Reply');
const Counselor = require('../models/Counselor');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
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
    Review.deleteMany({}),
    Report.deleteMany({}),
  ]);
  console.log('Cleared existing collections');

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  const [admin, moderator, alice, ben, casey, dee] = await User.create([
    { pseudonym: 'admin_sage', passwordHash, role: 'admin', avatarId: 7 },
    { pseudonym: 'mod_river', passwordHash, role: 'moderator', avatarId: 5 },
    { pseudonym: 'quiet_alice', passwordHash, role: 'user', avatarId: 0 },
    { pseudonym: 'steady_ben', passwordHash, role: 'user', avatarId: 1 },
    { pseudonym: 'hopeful_casey', passwordHash, role: 'user', avatarId: 4 },
    { pseudonym: 'wandering_dee', passwordHash, role: 'user', avatarId: 8 },
  ]);
  console.log('Seeded users');

  const posts = await Post.create([
    {
      author: alice._id,
      category: 'mental_health',
      content:
        "I've been feeling really overwhelmed balancing work and family lately. Some nights I just sit in the car for ten minutes before going inside because I don't have anything left to give.",
    },
    {
      author: ben._id,
      category: 'work_burnout',
      content:
        "Struggling with anxiety before job interviews. My hands shake, my mind goes blank, and I've started dreading the emails that say \"we'd like to schedule a call.\"",
    },
    {
      author: casey._id,
      category: 'relationships',
      content:
        "I don't feel heard in my relationship. Every time I try to bring something up, it turns into me apologizing for bringing it up at all.",
    },
    {
      author: dee._id,
      category: 'financial',
      content:
        'Financial stress is starting to affect my sleep. I lie awake doing math I already did three times that day, and it never comes out any better.',
    },
    {
      author: ben._id,
      category: 'family',
      content:
        "My parents still don't know I dropped a class. I keep rehearsing the conversation in my head and it never gets any easier.",
    },
    {
      author: casey._id,
      category: 'relationships',
      content:
        'Broke up with my partner of two years last week. Still processing it, still catching myself about to text them good morning.',
    },
    {
      author: dee._id,
      category: 'work_burnout',
      content:
        'Six months into this job and I already feel completely burnt out. I used to love what I do — I just want that feeling back.',
    },
    {
      // flagged: true simulates what createPost's keyword check would set for
      // content like this — the Post model's pre-save hook then guarantees
      // status becomes under_review, landing it in the moderation queue.
      author: alice._id,
      category: 'mental_health',
      content: 'Lately I keep thinking about wanting to die and I do not know who to talk to about it.',
      flagged: true,
    },
    {
      author: casey._id,
      category: 'gratitude',
      content:
        'Small win: I finally said no to a commitment I was dreading, and the sky did not fall. Grateful for this space for making that feel possible.',
    },
    {
      author: dee._id,
      category: 'gratitude',
      content:
        "Six months ago I couldn't get out of bed most mornings. Today I went for a walk just because I wanted to. Progress isn't always loud.",
    },
    {
      author: ben._id,
      category: 'gratitude',
      content:
        'Grateful for the friend who sat with me through a rough week without trying to fix anything — just stayed. That mattered more than advice ever could.',
    },
  ]);
  console.log(`Seeded ${posts.length} posts (1 auto-flagged into the moderation queue, 3 gratitude)`);

  const [post1, post2, , , post5] = posts;

  await Reply.create([
    {
      post: post1._id,
      author: casey._id,
      body: "Sending you support — you're not alone in feeling like there's nothing left some nights.",
      upvotes: 4,
    },
    {
      post: post1._id,
      author: dee._id,
      body: 'That ten minutes in the car is so real. Naming it helped me stop feeling guilty about needing it.',
      upvotes: 2,
    },
    {
      post: post2._id,
      author: alice._id,
      body: "Interviews trigger the same thing for me. Writing down two talking points beforehand has helped my mind go blank less.",
      upvotes: 3,
    },
    {
      post: post5._id,
      author: ben._id,
      body: 'For what it\'s worth, your parents finding out later than sooner rarely changes how much they love you. Rooting for you.',
      upvotes: 5,
    },
  ]);
  console.log('Seeded replies on posts');

  const [thread1, thread2, thread3, thread4, thread5] = await Thread.create([
    {
      author: alice._id,
      category: 'work_burnout',
      title: 'How do you actually reset after a brutal week?',
      body: "I hit a wall by Thursday most weeks and just coast until Monday starts it all over again. What actually helps you recover, not just distract yourself?",
      upvotes: 6,
    },
    {
      author: ben._id,
      category: 'financial',
      title: 'Anyone else budgeting down to the dollar right now?',
      body: "Between rent and everything else I'm tracking every single purchase. Would love tips from anyone who's made it through a tight stretch like this.",
      upvotes: 9,
    },
    {
      author: casey._id,
      category: 'relationships',
      title: 'Is it normal to still miss an ex you know was bad for you?',
      body: "It's been a month and I still catch myself wanting to text them. Anyone else been through this?",
      upvotes: 4,
    },
    {
      author: dee._id,
      category: 'mental_health',
      title: 'Small things that actually helped your anxiety',
      body: "Looking for the small, unglamorous stuff — not just \"try meditation.\" What's a tiny habit that made a real difference for you?",
      upvotes: 11,
    },
    {
      author: alice._id,
      category: 'gratitude',
      title: 'What is something small that went right for you this week?',
      body: "Trying to make a habit of noticing the good, not just the hard. Doesn't have to be big — I'll go first: I made a decent cup of coffee this morning and it genuinely helped.",
      upvotes: 14,
    },
  ]);
  console.log('Seeded threads');

  await Reply.create([
    {
      thread: thread1._id,
      author: ben._id,
      body: "I went through something similar — taking small steps really helped me. I started leaving my laptop in another room after 7pm.",
      upvotes: 5,
    },
    {
      thread: thread1._id,
      author: casey._id,
      body: "You're not alone in this. It's okay to feel this way. A short walk with no phone has been my reset button lately.",
      upvotes: 3,
    },
    {
      thread: thread2._id,
      author: dee._id,
      body: 'A no-spend week each month has genuinely helped me feel more in control, even when the numbers are still tight.',
      upvotes: 4,
    },
    {
      thread: thread3._id,
      author: alice._id,
      body: "Missing them doesn't mean the relationship was right for you. Both things can be true at once. Be gentle with yourself.",
      upvotes: 6,
    },
    {
      thread: thread4._id,
      author: casey._id,
      body: 'Writing down three things before bed — even boring ones — has quieted my mind more than anything else I\'ve tried.',
      upvotes: 8,
    },
    {
      thread: thread3._id,
      author: ben._id,
      body: 'This is spam, ignore, click here for free stuff',
      upvotes: 0,
      flagged: true,
    },
    {
      thread: thread5._id,
      author: dee._id,
      body: 'My kid laughed at one of my terrible jokes today. Ten out of ten, would recommend noticing the small stuff.',
      upvotes: 9,
    },
    {
      thread: thread5._id,
      author: ben._id,
      body: 'Got through a whole grocery trip without a panic attack for the first time in months. Small to most people, huge to me.',
      upvotes: 12,
    },
  ]);
  console.log('Seeded replies (1 pre-flagged for the moderation demo)');

  const [drChen, drOkafor, drLindqvist, drNandakumar, drWhitfield] = await Counselor.create([
    {
      name: 'Dr. Maya Chen',
      email: 'maya.chen@example.com',
      passwordHash,
      specialties: ['mental_health', 'work_burnout'],
      credentials:
        'Licensed Clinical Psychologist with 8+ years helping clients manage anxiety and build sustainable ways through burnout.',
      availability: 'Available this week',
      weeklySchedule: [
        { dayOfWeek: 1, slots: ['09:00', '10:00', '14:00'] },
        { dayOfWeek: 3, slots: ['09:00', '10:00', '14:00'] },
        { dayOfWeek: 5, slots: ['09:00', '11:00'] },
      ],
      rating: 4.9,
      ratingCount: 12,
      verified: true,
    },
    {
      name: 'Dr. Tunde Okafor',
      email: 'tunde.okafor@example.com',
      passwordHash,
      specialties: ['family', 'relationships'],
      credentials:
        'Licensed Marriage & Family Therapist focused on communication patterns and rebuilding trust in close relationships.',
      availability: 'Available next week',
      weeklySchedule: [
        { dayOfWeek: 2, slots: ['13:00', '15:00', '16:00'] },
        { dayOfWeek: 4, slots: ['13:00', '15:00', '16:00'] },
      ],
      rating: 4.7,
      ratingCount: 8,
      verified: true,
    },
    {
      name: 'Dr. Elin Lindqvist',
      email: 'elin.lindqvist@example.com',
      passwordHash,
      specialties: ['relationships', 'financial'],
      credentials:
        'Licensed Counselor specializing in the emotional side of money stress and its impact on relationships.',
      availability: 'Booking about 2 weeks out',
      weeklySchedule: [{ dayOfWeek: 5, slots: ['09:00', '10:00'] }],
      rating: 4.8,
      ratingCount: 6,
      verified: true,
    },
    {
      name: 'Dr. Priya Nandakumar',
      email: 'priya.nandakumar@example.com',
      passwordHash,
      specialties: ['work_burnout', 'financial'],
      credentials:
        'Licensed Clinical Social Worker with a background in workplace stress, career transitions, and financial anxiety.',
      availability: 'Available this week',
      weeklySchedule: [
        { dayOfWeek: 1, slots: ['11:00', '13:00'] },
        { dayOfWeek: 3, slots: ['11:00', '13:00'] },
        { dayOfWeek: 5, slots: ['11:00'] },
      ],
      rating: 4.6,
      ratingCount: 5,
      verified: true,
    },
    {
      name: 'Dr. Sam Whitfield',
      email: 'sam.whitfield@example.com',
      passwordHash,
      specialties: ['mental_health'],
      credentials: 'Licensed Counselor, profile pending admin verification.',
      availability: 'Pending verification',
      verified: false,
    },
  ]);
  console.log('Seeded counselors (1 left unverified for the verification demo)');

  await Booking.create([
    {
      user: alice._id,
      counselor: drChen._id,
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
    {
      user: dee._id,
      counselor: drNandakumar._id,
      requestedTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: 'pending',
    },
  ]);
  console.log('Seeded bookings');

  const completedBooking = await Booking.create({
    user: alice._id,
    counselor: drChen._id,
    requestedTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'completed',
  });
  await Review.create({
    counselor: drChen._id,
    user: alice._id,
    booking: completedBooking._id,
    rating: 5,
    comment: 'Dr. Chen was incredibly easy to talk to and gave me practical steps I could actually use.',
  });
  console.log('Seeded a completed booking with a review (for the review-demo)');

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
      targetId: posts[7]._id,
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
  console.log('  Users:      pseudonym=quiet_alice | steady_ben | hopeful_casey | wandering_dee');
  console.log('  Counselors (email login): maya.chen@example.com, tunde.okafor@example.com,');
  console.log('              elin.lindqvist@example.com, priya.nandakumar@example.com (all verified),');
  console.log('              sam.whitfield@example.com (unverified)');
  console.log(`\n  Unverified counselor id for the admin verify demo: ${drWhitfield._id}`);

  await mongoose.disconnect();
  console.log('\nDisconnected. Done.');
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
