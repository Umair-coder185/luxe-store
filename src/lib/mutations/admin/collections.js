import dbConnect from '@/lib/db';
import Collection from '@/models/Collection';
// Note: The current Product schema does NOT reference Collection.
// We import it just in case future updates add it, to strictly follow instructions.
import Product from '@/models/Product';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache/tags';

export async function createCollection(data) {
  await dbConnect();

  const existing = await Collection.findOne({ slug: data.slug }).lean();
  if (existing) {
    throw new Error('A collection with this slug already exists');
  }

  const payload = { ...data };
  if (!payload.startDate) payload.startDate = null;
  if (!payload.endDate) payload.endDate = null;

  const collection = await Collection.create(payload);
  revalidateTag(CACHE_TAGS.COLLECTIONS);
  return { ...collection.toObject(), _id: collection._id.toString() };
}

export async function updateCollection(id, data) {
  await dbConnect();

  if (data.slug) {
    const existing = await Collection.findOne({ slug: data.slug, _id: { $ne: id } }).lean();
    if (existing) {
      throw new Error('A collection with this slug already exists');
    }
  }

  const payload = { ...data };
  if (!payload.startDate) payload.startDate = null;
  if (!payload.endDate) payload.endDate = null;

  const collection = await Collection.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!collection) throw new Error('Collection not found');

  revalidateTag(CACHE_TAGS.COLLECTIONS);
  return { ...collection.toObject(), _id: collection._id.toString() };
}

export async function deleteCollection(id) {
  await dbConnect();

  const collection = await Collection.findById(id).lean();
  if (!collection) throw new Error('Collection not found');

  // Delete protection: Inspect Product model.
  // The current Product schema does not have a `collection` or `collections` field.
  // We check if it exists in the schema to be future-proof or gracefully allow deletion.
  if (Product.schema.paths.collection || Product.schema.paths.collections) {
    const query = Product.schema.paths.collections ? { collections: id } : { collection: id };
    const productCount = await Product.countDocuments(query);
    if (productCount > 0) {
      throw new Error(`Cannot delete collection. ${productCount} product(s) are currently assigned to it.`);
    }
  }

  await Collection.findByIdAndDelete(id);
  revalidateTag(CACHE_TAGS.COLLECTIONS);
  return { success: true };
}
