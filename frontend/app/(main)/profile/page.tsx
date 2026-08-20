import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserMaps, deleteMap, publishMap, unpublishMap } from '@/lib/actions/maps';
import { MyMapsList } from '@/components/profile/MyMapsList';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

export const metadata = {
  title: 'My Adventures | GridLine',
  description: 'View and manage your adventure prints and journey sculptures',
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/profile');
  }

  const maps = await getUserMaps();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedHeader variant="profile" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Adventures
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your saved and published adventure prints and journey sculptures
          </p>
        </div>

        <MyMapsList
          maps={maps}
          onDelete={deleteMap}
          onPublish={publishMap}
          onUnpublish={unpublishMap}
        />
      </div>
    </div>
  );
}

