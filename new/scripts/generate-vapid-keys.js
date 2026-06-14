// Run this script to generate VAPID keys for web push notifications
// Usage: node scripts/generate-vapid-keys.js

const webpush = require('web-push');

const vapidKeys = webpush.generateVAPIDKeys();

console.log('\n=== VAPID Keys Generated ===\n');
console.log('Add these to your .env.local:\n');
console.log(`VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);
console.log(`VAPID_EMAIL=mailto:your-email@example.com`);
console.log('\nAlso add VAPID_PUBLIC_KEY as NEXT_PUBLIC_VAPID_PUBLIC_KEY for the client.\n');
