import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { MarketingConsentModal } from '@/components/auth/MarketingConsentModal';

export const metadata = {
  title: 'Email Preferences | GridLine',
  description: 'Set your email preferences for GridLine',
};

export default async function ConsentPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Must be authenticated
  if (!user) {
    redirect('/login');
  }

  // Check if consent was already collected
  const consentCollected = user.user_metadata?.marketing_consent_collected;

  const params = await searchParams;
  const redirectTo = params.next || '/profile';

  // If consent already collected, redirect to destination
  if (consentCollected) {
    redirect(redirectTo);
  }

  return <MarketingConsentModal email={user.email!} redirectTo={redirectTo} />;
}
