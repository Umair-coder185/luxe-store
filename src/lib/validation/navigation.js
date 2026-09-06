import { z } from 'zod';

const linkSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  href: z.string().min(1, 'Link URL is required'),
});

const sectionSchema = z.object({
  label: z.string().min(1, 'Section label is required'),
  sourceType: z.enum(['CATEGORY_BRANDS', 'STATIC_LINKS']),
  category: z.string().nullable().optional(),
  links: z.array(linkSchema).optional().default([]),
});

export const navigationSchema = z.object({
  label: z.string().min(1, 'Navigation label is required').max(50),
  href: z.string().nullable().optional(),
  type: z.enum(['LINK', 'MEGA_MENU']),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true),
  sections: z.array(sectionSchema).optional().default([]),
}).refine(data => {
  if (data.type === 'LINK' && !data.href) {
    return false;
  }
  return true;
}, {
  message: 'Href is required for LINK type',
  path: ['href'],
});
