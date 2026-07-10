import api from '../api/axios';

// Web Push subscriptions carry the VAPID public key as a raw byte array, but
// env vars can only hold strings — this undoes the URL-safe base64 encoding.
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

export const isPushSupported = () =>
  'serviceWorker' in navigator && 'PushManager' in window && !!import.meta.env.VITE_VAPID_PUBLIC_KEY;

export const getPushSubscription = async () => {
  if (!isPushSupported()) return null;
  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
};

export const enablePush = async () => {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission was not granted.');
  }

  const registration = await navigator.serviceWorker.register('/sw.js');
  await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY),
  });

  await api.post('/push/subscribe', subscription.toJSON());
  return subscription;
};

export const disablePush = async () => {
  const subscription = await getPushSubscription();
  if (!subscription) return;
  await api.post('/push/unsubscribe', { endpoint: subscription.endpoint });
  await subscription.unsubscribe();
};
