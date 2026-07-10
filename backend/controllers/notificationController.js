const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');
const PushSubscription = require('../models/PushSubscription');
const webpush = require('../utils/webPush');

// Open Server-Sent-Events connections, keyed by recipient user id. Lets
// `notify()` push a new notification the instant it's created instead of
// clients polling for it. Single-instance in-memory map, same assumption the
// rest of this app already makes (see rateLimiters.js's postCooldown).
const sseClients = new Map();

// EventSource can't set an Authorization header, so the token travels as a
// query param on this one route instead of through the shared `protect`
// middleware.
const subscribeNotifications = (req, res) => {
  let userId;
  try {
    const decoded = jwt.verify(req.query.token || '', process.env.JWT_SECRET);
    userId = decoded.id;
  } catch {
    return res.status(401).end();
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.write('\n');

  if (!sseClients.has(userId)) sseClients.set(userId, new Set());
  sseClients.get(userId).add(res);

  const heartbeat = setInterval(() => res.write(': heartbeat\n\n'), 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.get(userId)?.delete(res);
  });
};

const getMyNotifications = async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user.id })
    .sort({ createdAt: -1 })
    .limit(30);

  res.json(notifications);
};

const markAllRead = async (req, res) => {
  await Notification.updateMany({ recipient: req.user.id, read: false }, { read: true });
  res.status(204).send();
};

// Not exposed as a route — called internally wherever a reply/booking
// update needs to notify someone. Never notifies a user about their own
// action (e.g. replying to your own post/thread).
// Booking-status changes are the one notification type worth waking a
// device for even when the tab isn't open — a client waiting to hear back
// on an anonymous session request. Other notification types stay in-app only.
const sendPushForBooking = async (recipient, message, link) => {
  const subscriptions = await PushSubscription.find({ user: recipient });
  const payload = JSON.stringify({ title: 'SafeSpace', body: message, link: link || '/' });

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(sub, payload);
      } catch (err) {
        // 404/410 means the browser dropped the subscription — clean it up
        // so we stop retrying a dead endpoint on every future notification.
        if (err.statusCode === 404 || err.statusCode === 410) {
          await PushSubscription.deleteOne({ _id: sub._id });
        }
      }
    })
  );
};

const notify = async ({ recipient, actor, type, message, link }) => {
  if (!recipient || String(recipient) === String(actor)) return;
  const notification = await Notification.create({ recipient, type, message, link });

  const connections = sseClients.get(String(recipient));
  if (connections) {
    const payload = `data: ${JSON.stringify(notification)}\n\n`;
    connections.forEach((res) => res.write(payload));
  }

  if (type === 'booking_status' && process.env.VAPID_PRIVATE_KEY) {
    await sendPushForBooking(recipient, message, link);
  }
};

module.exports = { getMyNotifications, markAllRead, notify, subscribeNotifications };
