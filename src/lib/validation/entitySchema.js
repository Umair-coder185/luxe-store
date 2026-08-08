import { z } from 'zod';

// ── Shared field definitions ─────────────────────────────────
const name = z.string().min(1, 'Name is required').max(100, 'Name is too long');

const slug = z
  .string()
  .min(1, 'Slug is required')
  .max(100, 'Slug is too long')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format');

const description = z.string().max(500, 'Description too long').optional();

const isActive = z.boolean().optional();

// ── Builders ─────────────────────────────────────────────────

/** Create: name + slug required, description + isActive optional, plus entity-specific fields */
export function createEntitySchema(extra = {}) {
  return z.object({ name, slug, description, isActive, ...extra });
}

/** Update: all fields optional (partial), plus entity-specific fields */
export function updateEntitySchema(extra = {}) {
  return createEntitySchema(extra).partial();
}