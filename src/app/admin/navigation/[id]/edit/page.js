import { requireAdminSC } from '@/lib/auth/guards';
import { redirect } from 'next/navigation';
import NavigationForm from '@/components/admin/navigation/NavigationForm';
import { getCategories } from '@/lib/queries/admin/categories';
import { getAdminNavigationItem } from '@/lib/queries/admin/navigation';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditNavigationPage({ params }) {
  const { error } = await requireAdminSC();
  if (error) redirect('/sign-in');
  
  const { id } = await params;

  const [categoriesRes, initialData] = await Promise.all([
    getCategories({ page: 1, limit: 1000 }),
    getAdminNavigationItem(id)
  ]);

  if (!initialData) {
    notFound();
  }

  const categories = categoriesRes.data || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Navigation Item</h1>
        <p className="mt-1 text-sm text-gray-500">Update storefront menu configuration.</p>
      </div>
      
      <NavigationForm categories={categories} initialData={initialData} />
    </div>
  );
}
