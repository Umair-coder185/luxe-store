import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { getCollections } from '@/lib/queries/admin/collections';
import { createCollection } from '@/lib/mutations/admin/collections';
import { validateCollection } from '@/lib/validation/catalog';

export async function GET(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';

    const result = await getCollections({ page, limit, search });
    return NextResponse.json({ success: true, data: result.data, meta: { total: result.total, page, limit, totalPages: result.totalPages } });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const body = await request.json();
    const validation = validateCollection(body);

    if (!validation.valid) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: validation.errors }, { status: 400 });
    }

    const collection = await createCollection(body);
    return NextResponse.json({ success: true, data: collection }, { status: 201 });
  } catch (err) {
    if (err.message.includes('already exists')) {
      return NextResponse.json({ success: false, error: err.message }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
