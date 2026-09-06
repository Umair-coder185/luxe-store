import mongoose from 'mongoose';

const { Schema } = mongoose;

const PromotionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Promotion name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    discountType: {
      type: String,
      enum: ['PERCENTAGE', 'FIXED_AMOUNT'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: [0.01, 'Discount value must be greater than zero'],
    },
    targetType: {
      type: String,
      enum: ['PRODUCT', 'BRAND', 'CATEGORY', 'COLLECTION'],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'targetModel',
    },
    startsAt: {
      type: Date,
      default: null,
    },
    endsAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Virtual property to dynamically define the ref based on targetType
PromotionSchema.virtual('targetModel').get(function () {
  switch (this.targetType) {
    case 'PRODUCT': return 'Product';
    case 'BRAND': return 'Brand';
    case 'CATEGORY': return 'Category';
    case 'COLLECTION': return 'Collection';
    default: return null;
  }
});

// Enforce percentage bounds
PromotionSchema.pre('validate', function (next) {
  if (this.discountType === 'PERCENTAGE') {
    if (this.discountValue <= 0 || this.discountValue > 100) {
      this.invalidate('discountValue', 'Percentage discount must be between 0.01 and 100');
    }
  }
  
  if (this.startsAt && this.endsAt) {
    if (this.startsAt >= this.endsAt) {
      this.invalidate('endsAt', 'End date must be strictly after start date');
    }
  }
  
  next();
});

// Indexes for typical queries (status/schedule evaluation)
PromotionSchema.index({ isActive: 1, startsAt: 1, endsAt: 1 });
PromotionSchema.index({ targetType: 1, targetId: 1 });

export default mongoose.models.Promotion || mongoose.model('Promotion', PromotionSchema);
