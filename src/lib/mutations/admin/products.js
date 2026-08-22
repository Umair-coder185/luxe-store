import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Brand from '@/models/Brand';
import Category from '@/models/Category';
import Collection from '@/models/Collection';
import Order from '@/models/Order';
import { deleteMultipleImages } from '@/services/cloudinary';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache/tags';

async function validateDependencies(payload) {
  const [brand, category] = await Promise.all([
    Brand.findById(payload.brand).lean(),
    Category.findById(payload.category).lean()
  ]);

  if (!brand) throw new Error('Selected Brand does not exist');
  if (!category) throw new Error('Selected Category does not exist');

  if (payload.collections && payload.collections.length > 0) {
    const collections = await Collection.find({ _id: { $in: payload.collections } }).lean();
    if (collections.length !== payload.collections.length) {
      throw new Error('One or more selected Collections do not exist');
    }
  }
}

function processStockAndSales(payload) {
  if (payload.variants && payload.variants.length > 0) {
    payload.stock = payload.variants.reduce((total, v) => total + (Number(v.stock) || 0), 0);
  }
  // Never trust client salesCount
  delete payload.salesCount;
}

export async function createProduct(data) {
  await dbConnect();

  const existing = await Product.findOne({ slug: data.slug }).lean();
  if (existing) {
    throw new Error('A product with this slug already exists');
  }

  await validateDependencies(data);
  processStockAndSales(data);

  const product = await Product.create(data);
  revalidateTag(CACHE_TAGS.PRODUCTS);
  return { ...product.toObject(), _id: product._id.toString() };
}

export async function updateProduct(id, data) {
  await dbConnect();

  if (data.slug) {
    const existing = await Product.findOne({ slug: data.slug, _id: { $ne: id } }).lean();
    if (existing) {
      throw new Error('A product with this slug already exists');
    }
  }

  const existingProduct = await Product.findById(id).lean();
  if (!existingProduct) throw new Error('Product not found');

  await validateDependencies(data);
  processStockAndSales(data);

  const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!updatedProduct) throw new Error('Product not found');

  // Handle removed images
  const existingPublicIds = existingProduct.images.map(img => img.publicId);
  const newPublicIds = data.images.map(img => img.publicId);
  const removedPublicIds = existingPublicIds.filter(id => !newPublicIds.includes(id));

  if (removedPublicIds.length > 0) {
    try {
      await deleteMultipleImages(removedPublicIds);
    } catch (err) {
      console.error('[Product Mutation] Failed to cleanup removed images:', err);
    }
  }

  revalidateTag(CACHE_TAGS.PRODUCTS);
  return { ...updatedProduct.toObject(), _id: updatedProduct._id.toString() };
}

export async function deleteProduct(id) {
  await dbConnect();

  const product = await Product.findById(id).lean();
  if (!product) throw new Error('Product not found');

  // Delete protection: Check Orders
  const orderCount = await Order.countDocuments({ 'items.product': id });
  if (orderCount > 0) {
    throw new Error(`Cannot delete product. It is referenced in ${orderCount} order(s). Disable it instead.`);
  }

  await Product.findByIdAndDelete(id);

  // Handle Cloudinary cleanup safely
  if (product.images && product.images.length > 0) {
    const publicIds = product.images.map(img => img.publicId);
    try {
      await deleteMultipleImages(publicIds);
    } catch (err) {
      console.error('[Product Mutation] Failed to cleanup images after product deletion:', err);
    }
  }

  revalidateTag(CACHE_TAGS.PRODUCTS);
  return { success: true };
}
