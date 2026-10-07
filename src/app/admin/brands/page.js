import { requireAdminSC } from '@/lib/auth/guards';
import { getBrands } from '@/lib/queries/admin/brands';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import EntityTable, { StatusBadge } from '@/components/admin/shared/EntityTable';

export const dynamic = 'force-dynamic'; // Ensure admin lists are fresh

export default async function BrandsPage({ searchParams }) {
  const { error } = await requireAdminSC();
  if (error) redirect('/sign-in');

  const { page, search } = await searchParams; // Next.js 15+ searchParams is a Promise
  const currentPage = parseInt(page || '1');
  const query = search || '';

  const { data, meta } = await getBrands({ page: currentPage, limit: 10, search: query });

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    { key: 'isActive', label: 'Status', render: StatusBadge },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Brands</h1>
          <p className="mt-1 text-sm text-gray-500">Manage product brands and manufacturers.</p>
        </div>
        <Link
          href="/admin/brands/new"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-bold tracking-wide rounded-xl shadow-md shadow-cyan-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          + Add Brand
        </Link>
      </div>

      {/* Search / Pagination placeholder - for brevity in UI, focusing on the table */}
      <EntityTable
        columns={columns}
        data={data}
        editBasePath="/admin/brands"
        deleteEndpoint="/api/admin/brands"
      />
    </div>
  );
}
