import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache/tags';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';

const fetchCategories = unstable_cache(
  async (page, limit, search, parentId, isActive) => {
    await dbConnect();

    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (parentId) query.parentId = parentId;
    if (isActive !== '') query.isActive = isActive;

    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      Category.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('parent', 'name')
        .lean(),
      Category.countDocuments(query),
    ]);

    return {
      categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
  ['admin-categories'],
  {
    tags: [CACHE_TAGS.CATEGORIES],
    revalidate: 120,
  },
);

export default function getCategories({
  page = 1,
  limit = 10,
  search,
  parentId,
  isActive,
} = {}) {
  return fetchCategories(
    page,
    limit,
    search ?? '',
    parentId ?? '',
    isActive === undefined ? '' : isActive,
  );
}