const PushSubscription = require('../models/PushSubscription');

const subscribe = async (req, res) => {
  const { endpoint, keys } = req.body;

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return res.status(400).json({ message: 'endpoint and keys.p256dh/keys.auth are required' });
  }

  await PushSubscription.findOneAndUpdate(
    { endpoint },
    { user: req.user.id, endpoint, keys },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({ subscribed: true });
};

const unsubscribe = async (req, res) => {
  const { endpoint } = req.body;
  await PushSubscription.deleteOne({ endpoint, user: req.user.id });
  res.json({ subscribed: false });
};

module.exports = { subscribe, unsubscribe };
