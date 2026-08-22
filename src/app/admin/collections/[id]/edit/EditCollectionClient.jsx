'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EntityForm from '@/components/admin/shared/EntityForm';

export default function EditCollectionClient({ collection }) {
  const router = useRouter();

  const fields = [
    { name: 'name', type: 'text', label: 'Collection Name', required: true, from: 'name' },
    { name: 'slug', type: 'slug', label: 'Slug', required: true, from: 'name' },
    { name: 'description', type: 'textarea', label: 'Description' },
    { name: 'startDate', type: 'date', label: 'Start Date' },
    { name: 'endDate', type: 'date', label: 'End Date' },
    { name: 'isActive', type: 'switch', label: 'Active Status' },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/collections" className="text-sm font-medium text-gray-500 hover:text-gray-900">
          &larr; Back to Collections
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Collection</h1>
        <p className="mt-1 text-sm text-gray-500">Update collection details.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <EntityForm
          fields={fields}
          action={`/api/admin/collections/${collection._id}`}
          method="PUT"
          initialValues={collection}
          submitLabel="Save Changes"
          onSuccess={() => {
            router.push('/admin/collections');
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}
