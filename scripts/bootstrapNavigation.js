require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Assuming you'll run this from the project root via `node scripts/bootstrapNavigation.js`
const { topNavLinks } = require('../src/lib/config/navigation.js');

const NavigationMenuSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    href: { type: String, default: null },
    type: { type: String, enum: ['LINK', 'MEGA_MENU'], required: true },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    sections: [
      {
        label: { type: String, required: true },
        sourceType: { type: String, enum: ['CATEGORY_BRANDS', 'STATIC_LINKS'], required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
        links: [
          {
            label: { type: String },
            href: { type: String },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const NavigationMenu = mongoose.models.NavigationMenu || mongoose.model('NavigationMenu', NavigationMenuSchema);

async function bootstrap() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  // Check if we already have navigation items
  const count = await NavigationMenu.countDocuments();
  if (count > 0) {
    console.log('Navigation already seeded. Skipping bootstrap.');
    process.exit(0);
  }

  let order = 10;
  for (const item of topNavLinks) {
    if (item.name === 'HOT DEALS') {
      console.log('Skipping dead link: HOT DEALS');
      continue;
    }

    const type = item.hasDropdown ? 'MEGA_MENU' : 'LINK';
    const navEntry = {
      label: item.name,
      href: item.href || null,
      type,
      order,
      isVisible: true,
      sections: [],
    };

    if (item.hasDropdown && item.megaMenu) {
      for (const column of item.megaMenu) {
        navEntry.sections.push({
          label: column.title,
          sourceType: 'STATIC_LINKS',
          category: null,
          links: column.items.map(link => ({
            label: link.name,
            href: link.href,
          })),
        });
      }
    }

    await NavigationMenu.create(navEntry);
    console.log(`Created: ${item.name}`);
    order += 10;
  }

  console.log('Navigation bootstrap complete.');
  process.exit(0);
}

bootstrap().catch(console.error);
