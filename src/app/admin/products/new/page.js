import { requireAdminSC } from '@/lib/auth/guards';
import { getProductFormData } from '@/lib/queries/admin/products';
import { redirect } from 'next/navigation';
import ProductForm from '@/components/admin/products/ProductForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Add Product',
};

export default async function NewProductPage() {
  const { error } = await requireAdminSC();
  if (error) redirect('/sign-in');

  const formData = await getProductFormData();

  return (
    <div className="max-w-6xl mx-auto py-2">
      <ProductForm
        mode="create"
        brands={formData.brands}
        categories={formData.categories}
        collections={formData.collections}
      />
    </div>
  );
}
