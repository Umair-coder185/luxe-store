import { requireAdminSC } from '@/lib/auth/guards';
import { getCollections } from '@/lib/queries/admin/collections';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import EntityTable, { StatusBadge } from '@/components/admin/shared/EntityTable';

export const dynamic = 'force-dynamic';

export default async function CollectionsPage({ searchParams }) {
  const { error } = await requireAdminSC();
  if (error) redirect('/sign-in');

  const { page, search } = await searchParams;
  const currentPage = parseInt(page || '1');
  const query = search || '';

  const { data, meta } = await getCollections({ page: currentPage, limit: 10, search: query });

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    {
      key: 'startDate',
      label: 'Start Date',
      render: (v) => v ? new Date(v).toLocaleDateString() : 'â€”'
    },
    {
      key: 'endDate',
      label: 'End Date',
      render: (v) => v ? new Date(v).toLocaleDateString() : 'â€”'
    },
    { key: 'isActive', label: 'Status', render: StatusBadge },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Collections</h1>
          <p className="mt-1 text-sm text-gray-500">Manage curated product collections and campaigns.</p>
        </div>
        <Link
          href="/admin/collections/new"
          className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Add Collection
        </Link>
      </div>

      <EntityTable
        columns={columns}
        data={data}
        editBasePath="/admin/collections"
        deleteEndpoint="/api/admin/collections"
      />
    </div>
  );
}
