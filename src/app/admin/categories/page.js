import { requireAdminSC } from '@/lib/auth/guards';
import { getCategories } from '@/lib/queries/admin/categories';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import CategoryTable from '@/components/admin/categories/CategoryTable';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage({ searchParams }) {
  const { error } = await requireAdminSC();
  if (error) redirect('/sign-in');

  const { page, search } = await searchParams;
  const currentPage = parseInt(page || '1');
  const query = search || '';

  const { data, meta } = await getCategories({ page: currentPage, limit: 10, search: query });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">Manage product categorization and hierarchy.</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold tracking-wide rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          + Add Category
        </Link>
      </div>

      <CategoryTable data={data} />
    </div>
  );
}
