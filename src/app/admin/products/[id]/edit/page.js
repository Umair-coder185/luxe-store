import { requireAdminSC } from '@/lib/auth/guards';
import { getProduct, getProductFormData } from '@/lib/queries/admin/products';
import { redirect, notFound } from 'next/navigation';
import ProductForm from '@/components/admin/products/ProductForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Edit Product',
};

export default async function EditProductPage({ params }) {
  const { error } = await requireAdminSC();
  if (error) redirect('/sign-in');

  const { id } = await params;
  const [rawProduct, formData] = await Promise.all([
    getProduct(id),
    getProductFormData(),
  ]);

  if (!rawProduct) {
    notFound();
  }

  // Ensure fully serializable plain data passed to Client Component
  const product = JSON.parse(JSON.stringify(rawProduct));

  return (
    <div className="max-w-6xl mx-auto py-2">
      <ProductForm
        mode="edit"
        productId={id}
        initialData={product}
        brands={formData.brands}
        categories={formData.categories}
        collections={formData.collections}
      />
    </div>
  );
}
