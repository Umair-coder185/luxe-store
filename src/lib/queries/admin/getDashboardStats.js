import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache/tags';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import Brand from '@/models/Brand';

const getDashboardStats = unstable_cache(
  async () => {
    await dbConnect();

    const [
      revenueResult,
      totalOrders,
      totalProducts,
      activeProducts,
      lowStockCount,
      lowStockProducts,
      recentOrders,
      activeOrders
    ] = await Promise.all([
      // Revenue from paid orders only
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),

      // Total orders
      Order.countDocuments(),

      // Total products
      Product.countDocuments(),

      // Active products
      Product.countDocuments({ isActive: true }),

      // Total low stock count (active and inactive)
      Product.countDocuments({ stock: { $lte: 5 } }),

      // Low stock list: products with stock <= 5
      Product.find({ stock: { $lte: 5 } })
        .sort({ stock: 1 })
        .populate('brand', 'name')
        .select('name stock images isActive brand')
        .lean()
        .limit(5),

      // Latest 5 orders
      Order.find()
        .sort({ createdAt: -1 })
        .populate('user', 'firstName lastName')
        .select('orderNumber total status paymentStatus createdAt user')
        .lean()
        .limit(5),

      // Pending/Processing orders
      Order.countDocuments({ status: { $in: ['pending', 'processing'] } })
    ]);

    return {
      totalRevenue: revenueResult[0]?.total ?? 0,
      totalOrders,
      totalProducts,
      activeProducts,
      activeOrders,
      lowStockCount,
      lowStockProducts: lowStockProducts.map(p => ({
        _id: p._id.toString(),
        name: p.name,
        stock: p.stock,
        isActive: p.isActive,
        image: p.images?.[0]?.url || null,
        brand: p.brand ? p.brand.name : 'Unknown Brand'
      })),
      recentOrders: recentOrders.map(order => ({
        _id: order._id.toString(),
        orderNumber: order.orderNumber,
        customer:
          [order.user?.firstName, order.user?.lastName]
            .filter(Boolean)
            .join(' ') || 'Unknown',
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus || 'pending',
        createdAt: order.createdAt.toISOString(),
      })),
    };
  },
  ['admin-dashboard-stats'],
  {
    tags: [CACHE_TAGS.DASHBOARD_STATS],
    revalidate: 60,
  }
);

export default getDashboardStats;