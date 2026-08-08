// models/Order.js
import mongoose from "mongoose";
const { Schema } = mongoose;

// Snapshot of a product AT THE TIME OF PURCHASE — not a live reference.
// This is intentional and explained below.
const orderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true }, // price AT PURCHASE, frozen
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String }, // if variant was selected
    color: { type: String },
  },
  { _id: false }
);

// Snapshot of shipping address — same reasoning as orderItemSchema.
const shippingAddressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true, // human-readable, e.g. "ORD-20260728-4471"
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: "Order must contain at least one item",
      },
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    subtotal: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, required: true, default: 0, min: 0 },
    tax: { type: Number, required: true, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },

    paymentIntentId: {
      type: String, // Stripe PaymentIntent ID
      unique: true,
      sparse: true, // allows multiple docs with null before payment is initiated
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

OrderSchema.index({ user: 1, createdAt: -1 }); // "My Orders" page
OrderSchema.index({ status: 1, createdAt: -1 }); // admin dashboard, filtered order queue

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);