import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth/guards';
import { CACHE_TAGS } from '@/lib/cache/tags';
import { createEntitySchema } from '@/lib/validation/entitySchema';
import getCategories from '@/lib/queries/admin/getCategories';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';

const createCategorySchema = createEntitySchema({
  parentId: z.string().nullable().optional(),
});

// ── GET: list categories (paginated, filterable) ─────────────
export async function GET(request) {
  const { error, status } = await requireAdmin(request);
  if (error) return NextResponse.json({ error }, { status });

  const { searchParams } = new URL(request.url);

  const data = await getCategories({
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 10,
    search: searchParams.get('search') || undefined,
    parentId: searchParams.get('parentId') || undefined,
    isActive: searchParams.has('isActive')
      ? searchParams.get('isActive') === 'true'
      : undefined,
  });

  return NextResponse.json(data);
}

// ── POST: create category ────────────────────────────────────
export async function POST(request) {
  const { error, status } = await requireAdmin(request);
  if (error) return NextResponse.json({ error }, { status });

  try {
    const body = await request.json();
    const result = createCategorySchema.safeParse(body);

    if (!result.success) {
      const details = result.error.issues.map(issue => ({
        field: issue.path[0],
        message: issue.message,
      }));
      return NextResponse.json(
        { error: 'Validation failed', details },
        { status: 422 },
      );
    }

    await dbConnect();
    const category = await Category.create(result.data);

    revalidateTag(CACHE_TAGS.CATEGORIES);

    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return NextResponse.json(
        { error: 'Duplicate entry', details: [{ field, message: 'Already exists' }] },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}