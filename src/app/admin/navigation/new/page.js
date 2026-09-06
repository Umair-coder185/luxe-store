import { requireAdminSC } from '@/lib/auth/guards';
import { redirect } from 'next/navigation';
import NavigationForm from '@/components/admin/navigation/NavigationForm';
import { getCategories } from '@/lib/queries/admin/categories';

export const dynamic = 'force-dynamic';

export default async function NewNavigationPage() {
  const { error } = await requireAdminSC();
  if (error) redirect('/sign-in');

  // Fetch categories to populate dropdowns for CATEGORY_BRANDS sections
  // We fetch all active categories
  const categoriesRes = await getCategories({ page: 1, limit: 1000 });
  const categories = categoriesRes.data || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add Navigation Item</h1>
        <p className="mt-1 text-sm text-gray-500">Create a new storefront menu item or mega menu.</p>
      </div>
      
      <NavigationForm categories={categories} />
    </div>
  );
}
