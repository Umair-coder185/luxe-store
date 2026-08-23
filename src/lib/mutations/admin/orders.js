import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import mongoose from 'mongoose';

const ALLOWED_TRANSITIONS = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

export async function updateOrderStatus(id, { status, note }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { error: 'Invalid order ID', status: 400 };
  }

  await dbConnect();
  
  // Use a transaction or optimistic concurrency if extremely high volume,
  // but for admin panel fetching the current doc and saving is standard.
  const order = await Order.findById(id);
  
  if (!order) {
    return { error: 'Order not found', status: 404 };
  }

  const currentStatus = order.status;
  const allowedNext = ALLOWED_TRANSITIONS[currentStatus] || [];
  
  if (!allowedNext.includes(status)) {
    return { 
      error: `Invalid transition. Cannot move from '${currentStatus}' to '${status}'`, 
      status: 409 
    };
  }
  
  order.status = status;
  order.statusHistory.push({
    status,
    changedAt: new Date(),
    note: note || undefined,
  });
  
  await order.save();
  
  return { success: true, order: order.toObject() };
}
