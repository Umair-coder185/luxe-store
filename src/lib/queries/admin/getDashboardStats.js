  import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache/tags';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User'; // ensures model registration for .populate('user', ...)

const getDashboardStats = unstable_cache(
  async () => {
    await dbConnect();

    const [
      revenueResult,
      totalOrders,
      totalProducts,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      // Total revenue (excludes cancelled orders)
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),

      // Total order count
      Order.countDocuments(),

      // Active product count
      Product.countDocuments({ isActive: true }),

      // Low stock: active products with stock <= 5, most critical first
      Product.find({ isActive: true, stock: { $lte: 5 } })
        .sort({ stock: 1 })
        .select('name stock')
        .lean()
        .limit(5),

      // Latest 5 orders with customer name
      Order.find()
        .sort({ createdAt: -1 })
        .populate('user', 'firstName lastName')
        .select('orderNumber total status createdAt user')
        .lean()
        .limit(5),
    ]);

    return {
      totalRevenue: revenueResult[0]?.total ?? 0,
      totalOrders,
      totalProducts,
      lowStockProducts,
      recentOrders: recentOrders.map(order => ({
        _id: order._id,
        orderNumber: order.orderNumber,
        customer:
          [order.user?.firstName, order.user?.lastName]
            .filter(Boolean)
            .join(' ') || 'Unknown',
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
      })),
    };
  },
  ['admin-dashboard-stats'],
  {
    tags: [CACHE_TAGS.DASHBOARD_STATS],
    revalidate: 60,
  },
);

export default getDashboardStats;