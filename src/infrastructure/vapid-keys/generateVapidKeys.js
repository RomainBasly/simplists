const webPush = require('web-push');

const vapidKeys = webPush.generateVAPIDKeys();

console.log('VapidPublic', vapidKeys.publicKey);
console.log('VapidPrivate', vapidKeys.privateKey);
