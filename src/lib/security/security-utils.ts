import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import crypto from 'crypto';

// Initialize DOMPurify for server-side use
const window = new JSDOM('').window;
const purify = DOMPurify(window as any);

/**
 * Security utility functions for the CV Builder application
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(content: string): string {
  return purify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: []
  });
}

/**
 * Generate a cryptographically secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return generateSecureToken(32);
}

/**
 * Validate CSRF token using constant-time comparison
 */
export function validateCSRFToken(providedToken: string, storedToken: string): boolean {
  if (!providedToken || !storedToken || providedToken.length !== storedToken.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < providedToken.length; i++) {
    result |= providedToken.charCodeAt(i) ^ storedToken.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isStrongPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

/**
 * Sanitize filename for safe storage
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars
    .replace(/\.{2,}/g, '.') // Remove multiple dots
    .replace(/^\.+|\.+$/g, '') // Remove leading/trailing dots
    .substring(0, 255); // Limit length
}

/**
 * Validate URL and ensure it's safe
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const allowedProtocols = ['http:', 'https:', 'mailto:'];
    return allowedProtocols.includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Validate file upload
 */
export function validateFileUpload(file: {
  name: string;
  size: number;
  type: string;
}): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 5MB limit' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' };
  }

  // Check for malicious filename patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /on\w+=/i,
  ];

  if (dangerousPatterns.some(pattern => pattern.test(file.name))) {
    return { valid: false, error: 'Filename contains potentially dangerous content' };
  }

  return { valid: true };
}

/**
 * Validate request origin
 */
export function validateOrigin(origin: string, allowedOrigins: string[]): boolean {
  return allowedOrigins.includes(origin);
}

/**
 * Validate referer header
 */
export function validateReferer(referer: string, allowedDomains: string[]): boolean {
  if (!referer) return false;
  
  try {
    const url = new URL(referer);
    return allowedDomains.some(domain => 
      url.hostname === domain || url.hostname.endsWith('.' + domain)
    );
  } catch {
    return false;
  }
}

/**
 * Encrypt sensitive data
 */
export function encryptData(data: string, key: string): string {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

/**
 * Decrypt sensitive data
 */
export function decryptData(encryptedData: string, key: string): string {
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * Anonymize user data for analytics
 */
export function anonymizeUserData(userData: any): any {
  return {
    ...userData,
    email: userData.email ? 'user@*****.com' : null,
    name: userData.name ? userData.name.charAt(0) + '***' : null,
    phone: userData.phone ? '***-***-' + userData.phone.slice(-4) : null,
    id: 'anonymous_' + Math.random().toString(36).substr(2, 9)
  };
}

/**
 * Check if data has expired based on retention policy
 */
export function isDataExpired(createdDate: Date, retentionDays: number): boolean {
  const expirationDate = new Date(createdDate);
  expirationDate.setDate(expirationDate.getDate() + retentionDays);
  return new Date() > expirationDate;
}

/**
 * Security headers configuration
 */
export const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
};

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  general: { windowMs: 15 * 60 * 1000, max: 100 }, // 100 requests per 15 min
  auth: { windowMs: 15 * 60 * 1000, max: 5 }, // 5 login attempts per 15 min
  api: { windowMs: 15 * 60 * 1000, max: 1000 }, // 1000 API calls per 15 min
  upload: { windowMs: 60 * 60 * 1000, max: 10 }, // 10 uploads per hour
};

/**
 * Data retention policies (in days)
 */
export const DATA_RETENTION_POLICIES = {
  userProfiles: 365 * 2, // 2 years
  cvDocuments: 365 * 5, // 5 years
  auditLogs: 365 * 7, // 7 years
  sessionData: 30, // 30 days
};
