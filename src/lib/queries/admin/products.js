import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Brand from '@/models/Brand';
import Category from '@/models/Category';
import Collection from '@/models/Collection';

export async function getProducts(options = {}) {
  await dbConnect();

  const { page = 1, limit = 20, search, category, brand, isActive } = options;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const query = {};

  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [
      { name: { $regex: escaped, $options: 'i' } },
      { slug: { $regex: escaped, $options: 'i' } }
    ];
  }

  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (isActive !== undefined && isActive !== '') {
    query.isActive = isActive === 'true' || isActive === true;
  }

  const [total, data] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate('category', 'name slug')
      .populate('brand', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean()
  ]);

  return {
    data: data.map(d => ({
      ...d,
      _id: d._id.toString(),
      category: d.category ? { ...d.category, _id: d.category._id.toString() } : null,
      brand: d.brand ? { ...d.brand, _id: d.brand._id.toString() } : null,
      collections: (d.collections || []).map(c => c.toString()),
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
    })),
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
  };
}

export async function getProduct(id) {
  await dbConnect();
  const product = await Product.findById(id).lean();
  if (!product) return null;

  return {
    ...product,
    _id: product._id.toString(),
    category: product.category.toString(),
    brand: product.brand.toString(),
    collections: (product.collections || []).map(c => c.toString()),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export async function getProductFormData() {
  await dbConnect();

  const [brands, categories, collections] = await Promise.all([
    Brand.find({ isActive: true }).select('name').sort({ name: 1 }).lean(),
    Category.find({ isActive: true }).select('name').sort({ name: 1 }).lean(),
    Collection.find({ isActive: true }).select('name').sort({ name: 1 }).lean()
  ]);

  return {
    brands: brands.map(b => ({ _id: b._id.toString(), name: b.name })),
    categories: categories.map(c => ({ _id: c._id.toString(), name: c.name })),
    collections: collections.map(c => ({ _id: c._id.toString(), name: c.name })),
  };
}
