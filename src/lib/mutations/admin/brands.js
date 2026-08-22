import dbConnect from '@/lib/db';
import Brand from '@/models/Brand';
import Product from '@/models/Product';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache/tags';

export async function createBrand(data) {
  await dbConnect();

  const existing = await Brand.findOne({ slug: data.slug }).lean();
  if (existing) {
    throw new Error('A brand with this slug already exists');
  }

  const brand = await Brand.create(data);
  revalidateTag(CACHE_TAGS.BRANDS);
  return { ...brand.toObject(), _id: brand._id.toString() };
}

export async function updateBrand(id, data) {
  await dbConnect();

  if (data.slug) {
    const existing = await Brand.findOne({ slug: data.slug, _id: { $ne: id } }).lean();
    if (existing) {
      throw new Error('A brand with this slug already exists');
    }
  }

  const brand = await Brand.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!brand) throw new Error('Brand not found');

  revalidateTag(CACHE_TAGS.BRANDS);
  return { ...brand.toObject(), _id: brand._id.toString() };
}

export async function deleteBrand(id) {
  await dbConnect();

  const brand = await Brand.findById(id).lean();
  if (!brand) throw new Error('Brand not found');

  // Delete protection: Check if products depend on this brand
  // Product model uses `brand` as an ObjectId
  const productCount = await Product.countDocuments({ brand: id });

  if (productCount > 0) {
    throw new Error(`Cannot delete brand. ${productCount} product(s) are currently assigned to it.`);
  }

  await Brand.findByIdAndDelete(id);
  revalidateTag(CACHE_TAGS.BRANDS);
  return { success: true };
}
