import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { getCollectionById } from '@/lib/queries/admin/collections';
import { updateCollection, deleteCollection } from '@/lib/mutations/admin/collections';
import { validateCollection } from '@/lib/validation/catalog';

export async function GET(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const { id } = await params;
    const collection = await getCollectionById(id);
    if (!collection) return NextResponse.json({ success: false, error: 'Collection not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: collection });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    if (body.slug && typeof body.slug === 'string') {
      body.slug = body.slug.trim().toLowerCase();
    }
    const validation = validateCollection(body);

    if (!validation.valid) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: validation.errors }, { status: 400 });
    }

    const collection = await updateCollection(id, body);
    return NextResponse.json({ success: true, data: collection });
  } catch (err) {
    if (err.message.includes('already exists')) {
      return NextResponse.json({ success: false, error: err.message }, { status: 409 });
    }
    if (err.message === 'Collection not found') {
      return NextResponse.json({ success: false, error: err.message }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const { id } = await params;
    await deleteCollection(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err.message === 'Collection not found') {
      return NextResponse.json({ success: false, error: err.message }, { status: 404 });
    }
    if (err.message.includes('Cannot delete')) {
      return NextResponse.json({ success: false, error: err.message }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
