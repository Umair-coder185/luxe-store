import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache/tags';

export async function createCategory(data) {
  await dbConnect();

  const existing = await Category.findOne({ slug: data.slug }).lean();
  if (existing) {
    throw new Error('A category with this slug already exists');
  }

  // Ensure parent is null if empty string
  const payload = { ...data, parent: data.parent || null };

  const category = await Category.create(payload);
  revalidateTag(CACHE_TAGS.CATEGORIES);
  return { ...category.toObject(), _id: category._id.toString() };
}

export async function updateCategory(id, data) {
  await dbConnect();

  if (data.slug) {
    const existing = await Category.findOne({ slug: data.slug, _id: { $ne: id } }).lean();
    if (existing) {
      throw new Error('A category with this slug already exists');
    }
  }

  const payload = { ...data, parent: data.parent || null };

  if (payload.parent) {
    if (payload.parent === id) {
      throw new Error('A category cannot be its own parent');
    }

    const proposedParent = await Category.findById(payload.parent).lean();
    if (proposedParent && proposedParent.parent && proposedParent.parent.toString() === id) {
      throw new Error('A direct circular relationship is not allowed');
    }
  }

  const category = await Category.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!category) throw new Error('Category not found');

  revalidateTag(CACHE_TAGS.CATEGORIES);
  return { ...category.toObject(), _id: category._id.toString() };
}

export async function deleteCategory(id) {
  await dbConnect();

  const category = await Category.findById(id).lean();
  if (!category) throw new Error('Category not found');

  // Delete protection 1: Check if products depend on this category
  const productCount = await Product.countDocuments({ category: id });
  if (productCount > 0) {
    throw new Error(`Cannot delete category. ${productCount} product(s) are currently assigned to it.`);
  }

  // Delete protection 2: Check if child categories depend on this category
  const childCount = await Category.countDocuments({ parent: id });
  if (childCount > 0) {
    throw new Error(`Cannot delete category. ${childCount} child categor(ies) depend on it.`);
  }

  await Category.findByIdAndDelete(id);
  revalidateTag(CACHE_TAGS.CATEGORIES);
  return { success: true };
}
