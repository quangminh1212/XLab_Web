import { NextRequest, NextResponse } from 'next/server';

/**
 * Error response type
 */
interface ErrorResponse {
  error: string;
  details?: string | Record<string, string[]>;
  status: number;
}

/**
 * Validator function type
 */
type ValidatorFn<T = any> = (data: T) => { 
  valid: boolean; 
  errors?: Record<string, string[]>;
};

/**
 * Create a JSON error response
 */
export function createErrorResponse(
  message: string,
  status: number = 400,
  details?: string | Record<string, string[]>
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    { 
      error: message, 
      details, 
      status 
    },
    { status }
  );
}

/**
 * Middleware to validate request body against a schema
 */
export function validateRequestBody<T = any>(
  handler: (req: NextRequest, data: T) => Promise<NextResponse> | NextResponse,
  validator: ValidatorFn<T>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // Parse request body
      const body = await req.json();
      
      // Validate body
      const validation = validator(body as T);
      
      if (!validation.valid) {
        return createErrorResponse(
          'Invalid request data',
          400,
          validation.errors
        );
      }
      
      // Call handler with validated data
      return handler(req, body as T);
    } catch (error) {
      console.error('Error in validateRequestBody:', error);
      return createErrorResponse(
        'Invalid JSON in request body',
        400
      );
    }
  };
}

/**
 * Middleware to validate request query parameters
 */
export function validateQueryParams(
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
  validator: (params: Record<string, string>) => { valid: boolean; errors?: Record<string, string[]> }
) {
  return (req: NextRequest): Promise<NextResponse> | NextResponse => {
    try {
      // Get query parameters
      const url = new URL(req.url);
      const params: Record<string, string> = {};
      
      // Convert URLSearchParams to a plain object
      url.searchParams.forEach((value, key) => {
        params[key] = value;
      });
      
      // Validate parameters
      const validation = validator(params);
      
      if (!validation.valid) {
        return createErrorResponse(
          'Invalid query parameters',
          400,
          validation.errors
        );
      }
      
      // Call handler
      return handler(req);
    } catch (error) {
      console.error('Error in validateQueryParams:', error);
      return createErrorResponse(
        'Error processing request',
        500
      );
    }
  };
}

/**
 * Utility to create a validator for required fields
 */
export function requiredFields<T = Record<string, any>>(
  fields: (keyof T)[]
): ValidatorFn<T> {
  return (data: T) => {
    const errors: Record<string, string[]> = {};
    
    fields.forEach(field => {
      const value = data[field];
      if (value === undefined || value === null || value === '') {
        const fieldName = String(field);
        errors[fieldName] = [`${fieldName} is required`];
      }
    });
    
    return {
      valid: Object.keys(errors).length === 0,
      errors: Object.keys(errors).length > 0 ? errors : undefined
    };
  };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validate a request ID parameter (e.g., UUID)
 */
export function validateId(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Rate limiting middleware
 * Note: For production, consider using a distributed cache like Redis
 */
const ipRequestCounts: Map<string, { count: number; timestamp: number }> = new Map();

export function rateLimit(
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
  {
    maxRequests = 50,
    windowMs = 60 * 1000, // 1 minute
    message = 'Too many requests, please try again later',
  } = {}
) {
  return (req: NextRequest): Promise<NextResponse> | NextResponse => {
    // Get client IP
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    
    // Get or initialize request count
    if (!ipRequestCounts.has(ip)) {
      ipRequestCounts.set(ip, { count: 1, timestamp: now });
      return handler(req);
    }
    
    const requestRecord = ipRequestCounts.get(ip)!;
    
    // Reset count if the time window has passed
    if (now - requestRecord.timestamp > windowMs) {
      ipRequestCounts.set(ip, { count: 1, timestamp: now });
      return handler(req);
    }
    
    // Increment request count
    requestRecord.count++;
    
    // Check if over limit
    if (requestRecord.count > maxRequests) {
      return createErrorResponse(message, 429);
    }
    
    // Within limit, continue to handler
    return handler(req);
  };
}

/**
 * Create a schema validator function
 */
export function createValidator<T = Record<string, any>>(
  schema: Record<keyof T, (value: any) => boolean | { valid: boolean; message?: string }>
): ValidatorFn<T> {
  return (data: T) => {
    const errors: Record<string, string[]> = {};
    
    Object.entries(schema).forEach(([field, validator]) => {
      const value = data[field as keyof T];
      const validationResult = validator(value);
      
      if (typeof validationResult === 'boolean') {
        if (!validationResult) {
          errors[field] = [`Invalid value for ${field}`];
        }
      } else if (!validationResult.valid) {
        errors[field] = [validationResult.message || `Invalid value for ${field}`];
      }
    });
    
    return {
      valid: Object.keys(errors).length === 0,
      errors: Object.keys(errors).length > 0 ? errors : undefined
    };
  };
} 