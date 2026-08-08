import mongoose from 'mongoose';
const { Schema } = mongoose;

const CollectionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Collection name is required'],
      trim: true,
      maxlength: [50, 'Collection name cannot exceed 50 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    image: {
      url: { type: String },
      publicId: { type: String },
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      { isActive: 1, startDate: -1 },
    ],
  }
);

export default mongoose.models.Collection || mongoose.model('Collection', CollectionSchema);