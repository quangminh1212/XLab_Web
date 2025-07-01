import crypto from 'crypto';

// Secure encryption configuration
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 16;

/**
 * Get the encryption key from environment or use fallback
 * NOTE: Always use a strong encryption key in production
 */
function getEncryptionKey(): string {
  return process.env.DATA_ENCRYPTION_KEY || 'default-key-change-in-production';
}

/**
 * Create a secure cryptographic hash of the input data
 * @param data Data to hash
 * @returns Hex-encoded SHA-256 hash
 */
export function createHash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Create a secure HMAC signature for data verification
 * @param data Data to sign
 * @returns Hex-encoded HMAC signature
 */
export function createSignature(data: string): string {
  const key = getEncryptionKey();
  return crypto.createHmac('sha256', key).update(data).digest('hex');
}

/**
 * Verify if a signature matches the expected data
 * @param data Original data
 * @param signature Signature to verify
 * @returns True if signature is valid
 */
export function verifySignature(data: string, signature: string): boolean {
  const expectedSignature = createSignature(data);
  // Use constant-time comparison to prevent timing attacks
  return expectedSignature === signature;
}

/**
 * Generate a secure random token of specified length
 * @param length Length of token in bytes (default: 32)
 * @returns Hex-encoded random token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Encrypt data using a secure method
 * @param plaintext Data to encrypt
 * @returns Object containing encrypted data and metadata
 */
export function encryptData(plaintext: string): {
  encrypted: string;
  iv: string;
  authTag: string;
} {
  // Generate a random IV
  const iv = crypto.randomBytes(16);
  
  // Derive a key from the master key
  const key = crypto.createHash('sha256').update(getEncryptionKey()).digest().subarray(0, 32);
  
  // Create cipher
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  // Encrypt the data
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Get auth tag
  const authTag = cipher.getAuthTag().toString('hex');
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag
  };
}

/**
 * Decrypt data that was encrypted with encryptData
 * @param encrypted Encrypted data
 * @param iv Initialization vector
 * @param authTag Authentication tag
 * @returns Decrypted plaintext
 */
export function decryptData(encrypted: string, iv: string, authTag: string): string {
  try {
    // Convert hex string to buffers
    const ivBuffer = Buffer.from(iv, 'hex');
    const tagBuffer = Buffer.from(authTag, 'hex');
    
    // Derive the same key
    const key = crypto.createHash('sha256').update(getEncryptionKey()).digest().subarray(0, 32);
    
    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, ivBuffer);
    decipher.setAuthTag(tagBuffer);
    
    // Decrypt
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Decryption failed - data may be corrupted or tampered with');
  }
}

/**
 * Hash a password securely
 * @param password Plain text password
 * @returns Secure hash and salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${hash}.${salt}`;
}

/**
 * Verify a password against a stored hash
 * @param password Plain text password to verify
 * @param hashedPassword Previously hashed password
 * @returns True if password matches
 */
export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [hash, salt] = hashedPassword.split('.');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(): string {
  return generateSecureToken();
}

/**
 * Create a secure filename from user identifier
 * @param identifier User email or other unique identifier
 * @returns Safe filename
 */
export function createSecureFilename(identifier: string): string {
  const hash = createHash(identifier);
  return `user_${hash.substring(0, 16)}`;
}

/**
 * Check if a password is strong enough
 * @param password Password to check
 * @returns Object with result and reason
 */
export function checkPasswordStrength(password: string): { isStrong: boolean; reason?: string } {
  if (password.length < 12) {
    return { isStrong: false, reason: 'Password must be at least 12 characters' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isStrong: false, reason: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isStrong: false, reason: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isStrong: false, reason: 'Password must contain at least one number' };
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { isStrong: false, reason: 'Password must contain at least one special character' };
  }
  
  return { isStrong: true };
}

/**
 * Sanitize user input to prevent XSS attacks
 * @param input User input
 * @returns Sanitized input
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validate email format
 * @param email Email to validate
 * @returns True if email format is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Generate a secure URL-friendly random ID
 */
export function generateSecureId(): string {
  return crypto.randomUUID();
} 