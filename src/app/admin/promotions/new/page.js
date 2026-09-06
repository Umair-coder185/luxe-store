import { requireAdminSC } from '@/lib/auth/guards';
import { redirect } from 'next/navigation';
import PromotionForm from '@/components/admin/promotions/PromotionForm';
import { getProducts } from '@/lib/queries/admin/products';
import { getBrands } from '@/lib/queries/admin/brands';
import { getCategories } from '@/lib/queries/admin/categories';
import { getCollections } from '@/lib/queries/admin/collections';

export const dynamic = 'force-dynamic';

export default async function NewPromotionPage() {
  const { error } = await requireAdminSC();
  if (error) redirect('/sign-in');

  // Fetch target options for the form (using unpaginated limits suitable for V1)
  const [productsRes, brandsRes, categoriesRes, collectionsRes] = await Promise.all([
    getProducts({ page: 1, limit: 1000 }),
    getBrands({ page: 1, limit: 500 }),
    getCategories({ page: 1, limit: 500 }),
    getCollections({ page: 1, limit: 100 })
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <a href="/admin/promotions" className="hover:text-gray-900 transition-colors">
            &larr; Promotions
          </a>
          <span>/</span>
          <span className="text-gray-900 font-medium">New Promotion</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Promotion</h1>
        <p className="mt-1 text-sm text-gray-500">Define a new discount rule for products, brands, categories, or collections.</p>
      </div>
      
      <PromotionForm 
        mode="create" 
        products={productsRes.data || []}
        brands={brandsRes.data || []}
        categories={categoriesRes.data || []}
        collections={collectionsRes.data || []}
      />
    </div>
  );
}
