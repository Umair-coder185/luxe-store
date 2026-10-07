import { requireAdminSC } from '@/lib/auth/guards';
import { getProducts, getProductFormData } from '@/lib/queries/admin/products';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ProductTable from '@/components/admin/products/ProductTable';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Products',
};

export default async function ProductsPage({ searchParams }) {
  const { error } = await requireAdminSC();
  if (error) redirect('/sign-in');

  const sp = await searchParams;
  const currentPage = parseInt(sp?.page || '1', 10);
  const search = sp?.search || '';
  const brand = sp?.brand || '';
  const category = sp?.category || '';
  const isActive = sp?.isActive ?? '';

  const [productsResult, formData] = await Promise.all([
    getProducts({
      page: currentPage,
      limit: 10,
      search,
      category,
      brand,
      isActive,
    }),
    getProductFormData(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage inventory, pricing, variants, and catalog classification.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold tracking-wide rounded-xl shadow-md shadow-violet-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          + Add Product
        </Link>
      </div>

      {/* Main Interactive Table & Filter View */}
      <ProductTable
        products={productsResult.data}
        total={productsResult.total}
        page={productsResult.page}
        totalPages={productsResult.totalPages}
        brands={formData.brands}
        categories={formData.categories}
        currentFilters={{
          search,
          brand,
          category,
          isActive,
        }}
      />
    </div>
  );
}
