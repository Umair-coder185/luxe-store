import { requireAdminSC } from '@/lib/auth/guards';
import { getCollectionById } from '@/lib/queries/admin/collections';
import { redirect, notFound } from 'next/navigation';
import EditCollectionClient from './EditCollectionClient';

export default async function EditCollectionPage({ params }) {
  const { error } = await requireAdminSC();
  if (error) redirect('/sign-in');

  const { id } = await params;
  const collection = await getCollectionById(id);

  if (!collection) notFound();

  // Format dates for HTML date input (YYYY-MM-DD)
  const initialValues = {
    ...collection,
    startDate: collection.startDate ? collection.startDate.split('T')[0] : '',
    endDate: collection.endDate ? collection.endDate.split('T')[0] : '',
  };

  return <EditCollectionClient collection={initialValues} />;
}
