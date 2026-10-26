import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { getCategoryById } from '@/lib/queries/admin/categories';
import { updateCategory, deleteCategory } from '@/lib/mutations/admin/categories';
import { validateCategory } from '@/lib/validation/catalog';

export async function GET(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const { id } = await params;
    const category = await getCategoryById(id);
    if (!category) return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: category });
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
    const validation = validateCategory(body);

    if (!validation.valid) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: validation.errors }, { status: 400 });
    }

    const category = await updateCategory(id, body);
    return NextResponse.json({ success: true, data: category });
  } catch (err) {
    if (err.message.includes('already exists') || err.message.includes('cannot be its own parent')) {
      return NextResponse.json({ success: false, error: err.message }, { status: 409 });
    }
    if (err.message === 'Category not found') {
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
    await deleteCategory(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err.message === 'Category not found') {
      return NextResponse.json({ success: false, error: err.message }, { status: 404 });
    }
    if (err.message.includes('Cannot delete')) {
      return NextResponse.json({ success: false, error: err.message }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
