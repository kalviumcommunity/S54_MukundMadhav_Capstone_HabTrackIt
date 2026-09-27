import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getDashboardData } from './actions';
import DashboardClient from './DashboardClient';

export const metadata = {
  title: 'Dashboard | HabTrackIt',
  description: 'Track your habits and consult HabAIt, your personalized habit coach.',
};

export default async function DashboardPage() {
  // NOTE: redirect() works by throwing — it must never be called inside a
  // try/catch, or the catch swallows it and every logged-out visit looks
  // like a Supabase outage (/login?error=supabase-unconfigured).
  let supabase;
  try {
    supabase = await createClient();
  } catch (err) {
    console.error('Dashboard loader error:', err.message);
    redirect('/login?error=supabase-unconfigured');
  }

  const { data: { user: authUser }, error } = await supabase.auth.getUser();
  if (error || !authUser) {
    redirect('/login');
  }

  let data;
  try {
    // Fetch MongoDB and profiles data on the server
    data = await getDashboardData();
  } catch (err) {
    // Supabase connection issues after auth succeeded
    console.error('Dashboard loader error:', err.message);
    redirect('/login?error=supabase-unconfigured');
  }

  return (
    <DashboardClient 
      initialProfile={data.profile}
      initialHabits={data.habits}
      initialLogs={data.logs}
      initialChartData={data.chartData}
      initialChatHistory={data.chatHistory}
    />
  );
}
