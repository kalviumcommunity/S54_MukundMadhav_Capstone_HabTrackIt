import webpush from 'web-push';
import { createAdminClient } from '@/utils/supabase/admin';

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  const vapidEmail = process.env.VAPID_EMAIL || 'mailto:admin@habtrackit.com';

  if (!vapidPublicKey || !vapidPrivateKey) {
    console.error('VAPID keys not configured');
    return Response.json({ error: 'VAPID keys missing' }, { status: 500 });
  }

  webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);

  const supabase = createAdminClient();

  // Get all subscriptions with notifications enabled
  const { data: subscriptions, error } = await supabase
    .from('push_subscriptions')
    .select('*');

  if (error) {
    console.error('Failed to fetch subscriptions:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  if (!subscriptions || subscriptions.length === 0) {
    return Response.json({ success: true, sent: 0, message: 'No subscribers' });
  }

  // Get today's date in IST
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  const todayStr = istDate.toISOString().split('T')[0];

  // Batch fetch all habits and logs for all subscribers (avoids N+1)
  const userIds = [...new Set(subscriptions.map(s => s.user_id))];

  const { data: allHabits } = await supabase
    .from('habits')
    .select('user_id, id, title, type')
    .in('user_id', userIds);

  const { data: allLogs } = await supabase
    .from('habit_logs')
    .select('user_id, habit_id, status')
    .eq('date', todayStr)
    .in('user_id', userIds);

  const habitsByUser = {};
  allHabits?.forEach(h => {
    if (!habitsByUser[h.user_id]) habitsByUser[h.user_id] = [];
    habitsByUser[h.user_id].push(h);
  });

  const logsByUser = {};
  allLogs?.forEach(l => {
    if (!logsByUser[l.user_id]) logsByUser[l.user_id] = [];
    logsByUser[l.user_id].push(l);
  });

  let sent = 0;
  let failed = 0;
  const invalidEndpoints = [];

  for (const sub of subscriptions) {
    try {
      const habits = habitsByUser[sub.user_id] || [];
      const todayLogs = logsByUser[sub.user_id] || [];
      const habitCount = habits.length;
      const completedCount = todayLogs.length;
      const pendingCount = habitCount - completedCount;

      let body;
      if (pendingCount <= 0) {
        body = `Great job! All ${habitCount} habits completed today. Keep it up!`;
      } else {
        body = `You have ${pendingCount} habit${pendingCount > 1 ? 's' : ''} left to complete today. Don't break your streak!`;
      }

      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        JSON.stringify({
          title: 'HabTrackIt',
          body,
          icon: '/favicon.svg',
        })
      );
      sent++;
    } catch (err) {
      failed++;
      // Remove invalid subscriptions (404 = subscription expired)
      if (err.statusCode === 404 || err.statusCode === 410) {
        invalidEndpoints.push(sub.endpoint);
      }
      console.warn(`Push failed for ${sub.user_id}:`, err.message);
    }
  }

  // Clean up invalid subscriptions
  if (invalidEndpoints.length > 0) {
    await supabase
      .from('push_subscriptions')
      .delete()
      .in('endpoint', invalidEndpoints);
  }

  return Response.json({
    success: true,
    sent,
    failed,
    total: subscriptions.length,
    cleaned: invalidEndpoints.length,
  });
}
