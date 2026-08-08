// constants/roles.js
// ─────────────────────────────────────────────────────────────
// Role definitions and permission mapping.
// Every role check in the project must reference these constants.
// Never hardcode "admin" or "user" as a raw string anywhere.
// ─────────────────────────────────────────────────────────────

/**
 * Available user roles.
 * Stored as lowercase to match Mongoose schema enum values.
 */
export const ROLES = Object.freeze({
  USER:  'user',
  ADMIN: 'admin',
});

/**
 * Permission categories — what actions are possible in the system.
 * Each permission is a unique string identifier.
 */
export const PERMISSIONS = Object.freeze({
  // Products
  PRODUCTS_VIEW:       'products:view',
  PRODUCTS_CREATE:     'products:create',
  PRODUCTS_UPDATE:     'products:update',
  PRODUCTS_DELETE:     'products:delete',

  // Categories
  CATEGORIES_VIEW:     'categories:view',
  CATEGORIES_CREATE:   'categories:create',
  CATEGORIES_UPDATE:   'categories:update',
  CATEGORIES_DELETE:   'categories:delete',

  // Brands
  BRANDS_VIEW:         'brands:view',
  BRANDS_CREATE:       'brands:create',
  BRANDS_UPDATE:       'brands:update',
  BRANDS_DELETE:       'brands:delete',

  // Collections
  COLLECTIONS_VIEW:    'collections:view',
  COLLECTIONS_CREATE:  'collections:create',
  COLLECTIONS_UPDATE:  'collections:update',
  COLLECTIONS_DELETE:  'collections:delete',

  // Orders
  ORDERS_VIEW:         'orders:view',
  ORDERS_MANAGE:       'orders:manage',

  // Customers
  CUSTOMERS_VIEW:      'customers:view',
  CUSTOMERS_MANAGE:    'customers:manage',

  // Reviews
  REVIEWS_MODERATE:    'reviews:moderate',

  // Coupons
  COUPONS_VIEW:        'coupons:view',
  COUPONS_CREATE:      'coupons:create',
  COUPONS_UPDATE:      'coupons:update',
  COUPONS_DELETE:      'coupons:delete',

  // Banners
  BANNERS_VIEW:        'banners:view',
  BANNERS_CREATE:      'banners:create',
  BANNERS_UPDATE:      'banners:update',
  BANNERS_DELETE:      'banners:delete',

  // Site settings
  SETTINGS_MANAGE:     'settings:manage',
});

/**
 * Maps each role to its allowed permissions.
 * User role only gets read access to public resources.
 * Admin role gets full access.
 */
export const ROLE_PERMISSIONS = Object.freeze({
  [ROLES.USER]: Object.freeze([]),
  // Users don't need explicit permissions here —
  // they access public APIs and their own account data
  // through ownership checks (userId === order.userId),
  // not role-based permission checks.

  [ROLES.ADMIN]: Object.freeze([
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.PRODUCTS_CREATE,
    PERMISSIONS.PRODUCTS_UPDATE,
    PERMISSIONS.PRODUCTS_DELETE,
    PERMISSIONS.CATEGORIES_VIEW,
    PERMISSIONS.CATEGORIES_CREATE,
    PERMISSIONS.CATEGORIES_UPDATE,
    PERMISSIONS.CATEGORIES_DELETE,
    PERMISSIONS.BRANDS_VIEW,
    PERMISSIONS.BRANDS_CREATE,
    PERMISSIONS.BRANDS_UPDATE,
    PERMISSIONS.BRANDS_DELETE,
    PERMISSIONS.COLLECTIONS_VIEW,
    PERMISSIONS.COLLECTIONS_CREATE,
    PERMISSIONS.COLLECTIONS_UPDATE,
    PERMISSIONS.COLLECTIONS_DELETE,
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.ORDERS_MANAGE,
    PERMISSIONS.CUSTOMERS_VIEW,
    PERMISSIONS.CUSTOMERS_MANAGE,
    PERMISSIONS.REVIEWS_MODERATE,
    PERMISSIONS.COUPONS_VIEW,
    PERMISSIONS.COUPONS_CREATE,
    PERMISSIONS.COUPONS_UPDATE,
    PERMISSIONS.COUPONS_DELETE,
    PERMISSIONS.BANNERS_VIEW,
    PERMISSIONS.BANNERS_CREATE,
    PERMISSIONS.BANNERS_UPDATE,
    PERMISSIONS.BANNERS_DELETE,
    PERMISSIONS.SETTINGS_MANAGE,
  ]),
});

/**
 * Valid roles array — useful for Mongoose schema enum
 * and validation.
 */
export const VALID_ROLES = Object.freeze(Object.values(ROLES));