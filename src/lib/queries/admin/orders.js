import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import mongoose from 'mongoose';

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export async function getOrders({ page = 1, limit = 20, search = '', status, paymentStatus } = {}) {
  await dbConnect();

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const query = {};

  if (search) {
    query.orderNumber = { $regex: escapeRegex(search), $options: 'i' };
  }

  if (status) query.status = status;
  if (paymentStatus) query.paymentStatus = paymentStatus;

  const [total, data] = await Promise.all([
    Order.countDocuments(query),
    Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'firstName lastName email')
      .lean()
  ]);

  return {
    data: data.map(d => ({
      ...d,
      _id: d._id.toString(),
      user: d.user ? { ...d.user, _id: d.user._id.toString() } : null,
      items: (d.items || []).map(item => ({
        ...item,
        product: item.product ? item.product.toString() : null
      })),
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
      statusHistory: (d.statusHistory || []).map(h => ({
        ...h,
        _id: h._id ? h._id.toString() : undefined,
        changedAt: h.changedAt.toISOString()
      }))
    })),
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
  };
}

export async function getOrderById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  await dbConnect();
  
  const order = await Order.findById(id).populate('user', 'firstName lastName email').lean();
  if (!order) return null;
  
  return {
    ...order,
    _id: order._id.toString(),
    user: order.user ? { ...order.user, _id: order.user._id.toString() } : null,
    items: (order.items || []).map(item => ({
      ...item,
      product: item.product ? item.product.toString() : null
    })),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    statusHistory: (order.statusHistory || []).map(h => ({
      ...h,
      _id: h._id ? h._id.toString() : undefined,
      changedAt: h.changedAt.toISOString()
    }))
  };
}
