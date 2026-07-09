const Notification = require('../models/Notification');

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
const notify = async ({ recipient, actor, type, message, link }) => {
  if (!recipient || String(recipient) === String(actor)) return;
  await Notification.create({ recipient, type, message, link });
};

module.exports = { getMyNotifications, markAllRead, notify };
