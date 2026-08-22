'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EntityForm from '@/components/admin/shared/EntityForm';

export default function EditCategoryClient({ category, parents }) {
  const router = useRouter();

  const parentOptions = parents.map(p => ({ value: p._id, label: p.name }));

  const fields = [
    { name: 'name', type: 'text', label: 'Category Name', required: true, from: 'name' },
    { name: 'slug', type: 'slug', label: 'Slug', required: true, from: 'name' },
    { name: 'parent', type: 'select', label: 'Parent Category', options: parentOptions },
    { name: 'description', type: 'textarea', label: 'Description' },
    { name: 'isActive', type: 'switch', label: 'Active Status' },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories" className="text-sm font-medium text-gray-500 hover:text-gray-900">
          &larr; Back to Categories
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Category</h1>
        <p className="mt-1 text-sm text-gray-500">Update category details and hierarchy.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <EntityForm
          fields={fields}
          action={`/api/admin/categories/${category._id}`}
          method="PUT"
          initialValues={category}
          submitLabel="Save Changes"
          onSuccess={() => {
            router.push('/admin/categories');
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}
