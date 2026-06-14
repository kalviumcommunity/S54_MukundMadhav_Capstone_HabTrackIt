import { createClient } from '@/utils/supabase/server';

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await request.json();
    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return Response.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    // Upsert subscription (one per endpoint per user)
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert(
        {
          user_id: user.id,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
        { onConflict: 'user_id, endpoint', ignoreDuplicates: false }
      );

    if (error) throw error;

    // Enable notifications on profile
    await supabase
      .from('profiles')
      .update({ notifications_enabled: true })
      .eq('id', user.id);

    return Response.json({ success: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { endpoint } = await request.json();

    if (endpoint) {
      // Remove specific subscription
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', user.id)
        .eq('endpoint', endpoint);
    } else {
      // Remove all subscriptions for user
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', user.id);
    }

    // Check if user has any remaining subscriptions
    const { count } = await supabase
      .from('push_subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Disable notifications if no subscriptions remain
    if (!count || count === 0) {
      await supabase
        .from('profiles')
        .update({ notifications_enabled: false })
        .eq('id', user.id);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
