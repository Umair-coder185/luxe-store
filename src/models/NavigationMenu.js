import mongoose from 'mongoose';
const { Schema } = mongoose;

const NavigationMenuSchema = new Schema(
  {
    label: {
      type: String,
      required: [true, 'Navigation label is required'],
      trim: true,
      maxlength: [50, 'Label cannot exceed 50 characters'],
    },
    href: {
      type: String,
      trim: true,
      default: null,
    },
    type: {
      type: String,
      enum: ['LINK', 'MEGA_MENU'],
      required: true,
      default: 'LINK',
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    sections: [
      {
        label: { type: String, required: true, trim: true },
        sourceType: {
          type: String,
          enum: ['CATEGORY_BRANDS', 'STATIC_LINKS'],
          required: true,
        },
        category: {
          type: Schema.Types.ObjectId,
          ref: 'Category',
          default: null,
        },
        links: [
          {
            label: { type: String, trim: true },
            href: { type: String, trim: true },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.NavigationMenu || mongoose.model('NavigationMenu', NavigationMenuSchema);
