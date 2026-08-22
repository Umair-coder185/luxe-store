import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { generateSignature } from '@/services/cloudinary';

export async function GET(request) {
  try {
    const { user, error } = await requireAdmin(request);
    if (error) return error;

    const data = generateSignature();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[Signature Route] Error:', err);
    return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 });
  }
}
