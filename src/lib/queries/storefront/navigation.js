import dbConnect from '@/lib/db';
import NavigationMenu from '@/models/NavigationMenu';
import Product from '@/models/Product';
import Category from '@/models/Category'; // Ensure it's registered
import Brand from '@/models/Brand'; // Ensure it's registered
import { unstable_cache } from 'next/cache';

async function fetchNavigationData() {
  await dbConnect();
  
  const menus = await NavigationMenu.find({ isVisible: true })
    .sort({ order: 1 })
    .lean();

  const resolvedMenus = [];

  for (const menu of menus) {
    const resolvedMenu = {
      id: menu._id.toString(),
      name: menu.label,
      href: menu.href || '#',
      hasDropdown: menu.type === 'MEGA_MENU',
      megaMenu: [],
    };

    if (menu.type === 'MEGA_MENU' && menu.sections) {
      for (const section of menu.sections) {
        const resolvedSection = {
          title: section.label,
          items: [],
        };

        if (section.sourceType === 'STATIC_LINKS') {
          resolvedSection.items = section.links.map(link => ({
            name: link.label,
            href: link.href,
          }));
        } else if (section.sourceType === 'CATEGORY_BRANDS' && section.category) {
          // Derive brands from active products in the category
          const categoryId = section.category;
          const activeBrands = await Product.aggregate([
            { $match: { category: categoryId, isActive: true } },
            { $group: { _id: '$brand' } },
            { $lookup: { from: 'brands', localField: '_id', foreignField: '_id', as: 'brandDetails' } },
            { $unwind: '$brandDetails' },
            { $match: { 'brandDetails.isActive': true } },
            { $sort: { 'brandDetails.name': 1 } }
          ]);

          if (activeBrands.length > 0) {
            resolvedSection.items = activeBrands.map(b => ({
              name: b.brandDetails.name,
              href: `/brands/${b.brandDetails.slug}`,
            }));
          }
        }

        // Only add section if it has items
        if (resolvedSection.items.length > 0) {
          resolvedMenu.megaMenu.push(resolvedSection);
        }
      }
    }

    resolvedMenus.push(resolvedMenu);
  }

  return resolvedMenus;
}

export const getStorefrontNavigation = unstable_cache(
  fetchNavigationData,
  ['storefront-navigation'],
  { tags: ['navigation', 'products', 'brands', 'categories'] }
);
