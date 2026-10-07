import { requireAdminSC } from '@/lib/auth/guards';
import { getCollections } from '@/lib/queries/admin/collections';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import CollectionTable from '@/components/admin/collections/CollectionTable';

export const dynamic = 'force-dynamic';

export default async function CollectionsPage({ searchParams }) {
  const { error } = await requireAdminSC();
  if (error) redirect('/sign-in');

  const { page, search } = await searchParams;
  const currentPage = parseInt(page || '1');
  const query = search || '';

  const { data, meta } = await getCollections({ page: currentPage, limit: 10, search: query });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Collections</h1>
          <p className="mt-1 text-sm text-gray-500">Manage curated product collections and campaigns.</p>
        </div>
        <Link
          href="/admin/collections/new"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-sm font-bold tracking-wide rounded-xl shadow-md shadow-fuchsia-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          + Add Collection
        </Link>
      </div>

      <CollectionTable data={data} />
    </div>
  );
}
