// config/env.js
// ─────────────────────────────────────────────────────────────
// Centralized environment configuration.
// Every module in the project imports from HERE — never
// calls process.env directly.  Missing critical keys crash
// the server at startup so bugs are caught before production.
// ─────────────────────────────────────────────────────────────

/**
 * Reads a required env variable.
 * Throws immediately if the key is missing or empty,
 * which means the app won't even start with bad config.
 *
 * @param {string} key - The environment variable name.
 * @returns {string}
 */
function required(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[config/env] CRITICAL: Missing required environment variable "${key}". ` +
      `The server cannot start without it. Check your .env.local file.`
    );
  }
  return value;
}

/**
 * Reads an optional env variable with a fallback.
 *
 * @param {string} key
 * @param {string} fallback - Default value when the key is absent.
 * @returns {string}
 */
function optional(key, fallback = '') {
  return process.env[key] || fallback;
}

// ── Application ──────────────────────────────────────────────
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PROD = NODE_ENV === 'production';
const IS_DEV  = NODE_ENV === 'development';

// ── Database (MongoDB) ───────────────────────────────────────
const MONGODB_URI = required('MONGODB_URI');

// ── JWT ──────────────────────────────────────────────────────
// Separate secrets for access & refresh tokens so that
// compromising one does NOT compromise the other.
const JWT_ACCESS_SECRET     = required('JWT_ACCESS_SECRET');
const JWT_REFRESH_SECRET    = required('JWT_REFRESH_SECRET');
const JWT_ACCESS_EXPIRES_IN = optional('JWT_ACCESS_EXPIRES_IN', '15m');
const JWT_REFRESH_EXPIRES_IN = optional('JWT_REFRESH_EXPIRES_IN', '7d');

// ── Cookies ──────────────────────────────────────────────────
const COOKIE_SECRET  = optional('COOKIE_SECRET', 'capsule-hub-cookie-secret');
const COOKIE_DOMAIN  = optional('COOKIE_DOMAIN', '');

// ── Stripe ───────────────────────────────────────────────────
const STRIPE_SECRET_KEY      = optional('STRIPE_SECRET_KEY', '');
const STRIPE_WEBHOOK_SECRET  = optional('STRIPE_WEBHOOK_SECRET', '');
const STRIPE_PUBLISHABLE_KEY = optional('STRIPE_PUBLISHABLE_KEY', '');

// ── Cloudinary ───────────────────────────────────────────────
const CLOUDINARY_CLOUD_NAME = optional('CLOUDINARY_CLOUD_NAME', '');
const CLOUDINARY_API_KEY    = optional('CLOUDINARY_API_KEY', '');
const CLOUDINARY_API_SECRET = optional('CLOUDINARY_API_SECRET', '');

// ── Email ────────────────────────────────────────────────────
const SMTP_HOST     = optional('SMTP_HOST', '');
const SMTP_PORT     = optional('SMTP_PORT', '587');
const SMTP_USER     = optional('SMTP_USER', '');
const SMTP_PASS     = optional('SMTP_PASS', '');
const EMAIL_FROM    = optional('EMAIL_FROM', 'no-reply@capsulehub.com');

// ── App ──────────────────────────────────────────────────────
const APP_URL    = optional('APP_URL', 'http://localhost:3000');
const SITE_NAME  = optional('SITE_NAME', 'Capsule Hub');

// ── Export ───────────────────────────────────────────────────
const env = {
  // Flags
  nodeEnv: NODE_ENV,
  isProd:  IS_PROD,
  isDev:   IS_DEV,

  // Database
  mongodb: {
    uri: MONGODB_URI,
  },

  // JWT
  jwt: {
    accessSecret:     JWT_ACCESS_SECRET,
    refreshSecret:    JWT_REFRESH_SECRET,
    accessExpiresIn:  JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: JWT_REFRESH_EXPIRES_IN,
  },

  // Cookies
  cookie: {
    secret: COOKIE_SECRET,
    domain: COOKIE_DOMAIN,
  },

  // Stripe
  stripe: {
    secretKey:      STRIPE_SECRET_KEY,
    webhookSecret:  STRIPE_WEBHOOK_SECRET,
    publishableKey: STRIPE_PUBLISHABLE_KEY,
  },

  // Cloudinary
  cloudinary: {
    cloudName: CLOUDINARY_CLOUD_NAME,
    apiKey:    CLOUDINARY_API_KEY,
    apiSecret: CLOUDINARY_API_SECRET,
  },

  // Email
  email: {
    smtp: { host: SMTP_HOST, port: SMTP_PORT, user: SMTP_USER, pass: SMTP_PASS },
    from: EMAIL_FROM,
  },

  // App
  app: {
    url:  APP_URL,
    name: SITE_NAME,
  },
};

// Freeze so no module can accidentally mutate config at runtime.
Object.freeze(env);
Object.freeze(env.mongodb);
Object.freeze(env.jwt);
Object.freeze(env.cookie);
Object.freeze(env.stripe);
Object.freeze(env.cloudinary);
Object.freeze(env.email.smtp);
Object.freeze(env.email);
Object.freeze(env.app);

export default env;