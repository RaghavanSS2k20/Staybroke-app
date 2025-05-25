import webpush from 'web-push';
export function getWebPushClient() {
  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY,VAPID_MAIL_TO } = process.env;

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    throw new Error('Missing VAPID keys in environment variables');
  }

  webpush.setVapidDetails(
    `mailto:${process.env.VAPID_MAIL_TO}`,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );

  return webpush;
}

export const subscriptions = [];
