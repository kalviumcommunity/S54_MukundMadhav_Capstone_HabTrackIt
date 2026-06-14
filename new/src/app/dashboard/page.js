import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getDashboardData } from './actions';
import DashboardClient from './DashboardClient';

export const metadata = {
  title: 'Dashboard | HabTrackIt',
  description: 'Track your habits and consult HabAIt, your personalized habit coach.',
};

export default async function DashboardPage() {
  let user = null;
  let data = null;

  try {
    const supabase = await createClient();
    const { data: { user: authUser }, error } = await supabase.auth.getUser();
    
    if (error || !authUser) {
      redirect('/login');
    }
    
    user = authUser;
    // Fetch MongoDB and profiles data on the server
    data = await getDashboardData();
  } catch (err) {
    // If Supabase is not configured yet or has connection issues
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
