import { requireAdminSC } from '@/lib/auth/guards';
import { getBrandById } from '@/lib/queries/admin/brands';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import EntityForm from '@/components/admin/shared/EntityForm';
import EditBrandClient from './EditBrandClient';

export default async function EditBrandPage({ params }) {
  const { error } = await requireAdminSC();
  if (error) redirect('/sign-in');

  const { id } = await params;
  const brand = await getBrandById(id);

  if (!brand) notFound();

  return <EditBrandClient brand={brand} />;
}
