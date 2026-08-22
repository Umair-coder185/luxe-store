import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { deleteImage } from '@/services/cloudinary';

export async function POST(request) {
  try {
    const { user, error } = await requireAdmin(request);
    if (error) return error;

    const { publicId } = await request.json();
    if (!publicId) {
      return NextResponse.json({ error: 'publicId is required' }, { status: 400 });
    }

    await deleteImage(publicId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Media Delete Route] Error:', err);
    if (err.message.includes('Invalid publicId')) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
