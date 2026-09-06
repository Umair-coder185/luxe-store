import { requireAdminSC } from '@/lib/auth/guards';
import { redirect, notFound } from 'next/navigation';
import PromotionForm from '@/components/admin/promotions/PromotionForm';
import { getPromotion } from '@/lib/queries/admin/promotions';
import { getProducts } from '@/lib/queries/admin/products';
import { getBrands } from '@/lib/queries/admin/brands';
import { getCategories } from '@/lib/queries/admin/categories';
import { getCollections } from '@/lib/queries/admin/collections';

export const dynamic = 'force-dynamic';

export default async function EditPromotionPage({ params }) {
  const { error } = await requireAdminSC();
  if (error) redirect('/sign-in');
  
  const { id } = await params;

  const [promotion, productsRes, brandsRes, categoriesRes, collectionsRes] = await Promise.all([
    getPromotion(id),
    getProducts({ page: 1, limit: 1000 }),
    getBrands({ page: 1, limit: 500 }),
    getCategories({ page: 1, limit: 500 }),
    getCollections({ page: 1, limit: 100 })
  ]);

  if (!promotion) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <a href="/admin/promotions" className="hover:text-gray-900 transition-colors">
            &larr; Promotions
          </a>
          <span>/</span>
          <span className="text-gray-900 font-medium">Edit Promotion</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Promotion: {promotion.name}</h1>
        <p className="mt-1 text-sm text-gray-500">Update the discount rules, schedule, and targeting.</p>
      </div>
      
      <PromotionForm 
        mode="edit" 
        initialData={promotion}
        products={productsRes.data || []}
        brands={brandsRes.data || []}
        categories={categoriesRes.data || []}
        collections={collectionsRes.data || []}
      />
    </div>
  );
}
