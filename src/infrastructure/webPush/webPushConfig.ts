import webPush from 'web-push';
import dotenv from 'dotenv';

dotenv.config();

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

function initiateWebPush() {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    throw new Error('Missing VAPID Credentials');
  }
  webPush.setVapidDetails('mailto:isisetthea@gmail.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  return webPush;
}

const initiatedWebPush = initiateWebPush();

export default initiatedWebPush;
