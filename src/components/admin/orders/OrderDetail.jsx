'use client';

import { capitalize } from './OrderTable';
import OrderStatusControl from './OrderStatusControl';

const PAYMENT_STYLES = {
  pending: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  paid: 'bg-green-50 text-green-700 ring-green-600/20',
  failed: 'bg-red-50 text-red-700 ring-red-600/20',
  refunded: 'bg-gray-100 text-gray-500 ring-gray-500/10',
};

const STATUS_STYLES = {
  pending: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  processing: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  shipped: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  delivered: 'bg-green-50 text-green-700 ring-green-600/20',
  cancelled: 'bg-gray-100 text-gray-500 ring-gray-500/10',
};

export default function OrderDetail({ order }) {
  const customerName = order.user 
    ? `${order.user.firstName} ${order.user.lastName}`.trim() 
    : order.shippingAddress?.fullName || 'Unknown';
    
  const customerEmail = order.user?.email || 'No email available';
  
  const paymentStyle = PAYMENT_STYLES[order.paymentStatus] || PAYMENT_STYLES.pending;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Main Details */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Items Section */}
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
          </div>
          <div className="px-6 py-4">
            <ul className="divide-y divide-gray-100">
              {order.items.map((item, index) => (
                <li key={index} className="py-4 flex gap-4">
                  {item.image ? (
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 shrink-0 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                  
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between text-sm font-medium text-gray-900">
                      <h4>{item.name}</h4>
                      <p className="ml-4">Rs {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {(item.size || item.color) && (
                        <p>
                          {item.size && `Size: ${item.size}`} 
                          {item.size && item.color && ' | '}
                          {item.color && `Color: ${item.color}`}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-gray-500">
                        Qty {item.quantity} × Rs {item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Timeline Section */}
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">Timeline</h3>
          </div>
          <div className="px-6 py-4">
            {order.statusHistory && order.statusHistory.length > 0 ? (
              <ul className="relative border-l border-gray-200 ml-3 space-y-6">
                {order.statusHistory.map((history, idx) => (
                  <li key={idx} className="ml-6">
                    <span className="absolute -left-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 ring-4 ring-white"></span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        Order marked as {capitalize(history.status)}
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        {new Date(history.changedAt).toLocaleString()}
                      </span>
                      {history.note && (
                        <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded-md">
                          Note: {history.note}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 py-4 text-center">No timeline history available.</p>
            )}
          </div>
        </div>

      </div>

      {/* Right Column - Sidebar */}
      <div className="space-y-8">
        
        {/* Status Control */}
        <OrderStatusControl orderId={order._id} currentStatus={order.status} />

        {/* Customer & Shipping */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Customer</h3>
            <p className="text-sm text-gray-600">{customerName}</p>
            <p className="text-sm text-gray-600">{customerEmail}</p>
          </div>
          
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Shipping Address</h3>
            <address className="text-sm text-gray-600 not-italic">
              <p>{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}{order.shippingAddress?.state ? `, ${order.shippingAddress.state}` : ''} {order.shippingAddress?.zip}</p>
              <p>{order.shippingAddress?.country}</p>
              <p className="mt-2 text-gray-500">Phone: {order.shippingAddress?.phone}</p>
            </address>
          </div>
        </div>

        {/* Summary & Totals */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Summary</h3>
          
          <dl className="space-y-3 text-sm text-gray-600 mb-6 border-b border-gray-100 pb-6">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>Rs {order.subtotal?.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>Rs {order.shippingFee?.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Tax</dt>
              <dd>Rs {order.tax?.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between text-base font-medium text-gray-900 pt-3 border-t border-gray-100">
              <dt>Total</dt>
              <dd>Rs {order.total?.toLocaleString()}</dd>
            </div>
          </dl>

          <h3 className="text-sm font-medium text-gray-900 mb-4">Payment</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Status:</span>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${paymentStyle}`}>
                {capitalize(order.paymentStatus)}
              </span>
            </div>
            {order.paymentIntentId && (
              <div className="text-sm text-gray-600 break-all">
                <span className="block mb-1">Transaction ID:</span>
                <span className="font-mono text-xs">{order.paymentIntentId}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
