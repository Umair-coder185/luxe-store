import { requireAdminSC } from '@/lib/auth/guards';
import { getAdminNavigation } from '@/lib/queries/admin/navigation';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import NavigationTable from '@/components/admin/navigation/NavigationTable';

export const dynamic = 'force-dynamic';

export default async function NavigationPage() {
  const { error } = await requireAdminSC();
  if (error) redirect('/sign-in');

  const data = await getAdminNavigation();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Navigation</h1>
          <p className="mt-1 text-sm text-gray-500">Manage storefront navigation and mega menus.</p>
        </div>
        <Link
          href="/admin/navigation/new"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold tracking-wide rounded-xl shadow-md shadow-emerald-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          + Add Menu Item
        </Link>
      </div>

      <NavigationTable data={data} />
    </div>
  );
}
