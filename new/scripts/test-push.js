// Test push notification — sends to all subscribed users
// Usage: node scripts/test-push.js

const webpush = require('web-push');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

webpush.setVapidDetails(
  process.env.VAPID_EMAIL || 'mailto:test@test.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

async function test() {
  const { data: subs, error } = await supabase.from('push_subscriptions').select('*');
  if (error) { console.error('DB error:', error); return; }
  if (!subs || subs.length === 0) { console.log('No subscriptions found. Open the dashboard and click the bell icon first.'); return; }

  console.log(`Found ${subs.length} subscription(s). Sending test push...`);

  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify({ title: 'HabTrackIt Test', body: 'Push notifications are working!', icon: '/favicon.svg' })
      );
      console.log(`  ✓ Sent to ${sub.user_id}`);
    } catch (err) {
      console.error(`  ✗ Failed for ${sub.user_id}:`, err.message);
    }
  }
}

test();
