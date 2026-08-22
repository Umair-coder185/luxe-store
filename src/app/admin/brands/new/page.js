'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EntityForm from '@/components/admin/shared/EntityForm';

export default function NewBrandPage() {
  const router = useRouter();

  const fields = [
    { name: 'name', type: 'text', label: 'Brand Name', required: true, from: 'name' },
    { name: 'slug', type: 'slug', label: 'Slug', required: true, from: 'name' },
    { name: 'description', type: 'textarea', label: 'Description' },
    { name: 'isActive', type: 'switch', label: 'Active Status' },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/brands" className="text-sm font-medium text-gray-500 hover:text-gray-900">
          &larr; Back to Brands
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add New Brand</h1>
        <p className="mt-1 text-sm text-gray-500">Create a new brand to associate with products.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <EntityForm
          fields={fields}
          action="/api/admin/brands"
          method="POST"
          initialValues={{ isActive: true }}
          submitLabel="Create Brand"
          onSuccess={() => {
            router.push('/admin/brands');
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}
