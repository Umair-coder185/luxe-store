import { revalidateTag } from "next/cache";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  revalidateTag('navigation');
  return Response.json({ success: true, message: 'Revalidated navigation cache' });
}
