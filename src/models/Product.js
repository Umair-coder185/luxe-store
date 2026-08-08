// models/Product.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [150, "Product name cannot exceed 150 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true, // unique already creates the index — no separate index:true needed
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    compareAtPrice: {
      type: Number,
      min: [0, "Compare-at price cannot be negative"],
    },
    images: {
      type: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
        },
      ],
      validate: {
        validator: (v) => v.length > 0,
        message: "At least one image is required",
      },
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: String,
      trim: true,
      // Only keep this indexed if you'll actually filter by brand on the storefront.
      // If it's display-only for now, drop `index: true` until that query exists.
      index: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    salesCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Display-only / non-filterable specs (material, care instructions, etc.)
    attributes: {
      type: Map,
      of: String,
    },

    // Filterable variants (size, color) — separate from `attributes` on purpose.
    // If you don't need variants yet, this array can just stay empty ([]),
    // but the shape is here so you don't have to migrate data later.
    variants: {
      type: [
        {
          size: { type: String, trim: true },
          color: { type: String, trim: true },
          sku: { type: String, trim: true },
          stock: { type: Number, default: 0, min: 0 },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// Compound indexes matched to real query patterns:
// isActive first (equality filter, same tier as category),
// category second (equality filter), sort field last.
ProductSchema.index({ isActive: 1, category: 1, createdAt: -1 });
ProductSchema.index({ isActive: 1, category: 1, salesCount: -1 });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);