import { NextRequest, NextResponse } from 'next/server';
import { 
  validateRequestBody, 
  requiredFields,
  validateEmail,
  createErrorResponse,
  rateLimit
} from '@/lib/apiValidation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Example request data type
interface ExampleRequest {
  name: string;
  email: string;
  message: string;
}

// Define a validator for our request body
const validateExample = (data: ExampleRequest) => {
  const errors: Record<string, string[]> = {};
  
  // Check required fields
  if (!data.name || data.name.trim() === '') {
    errors.name = ['Name is required'];
  }
  
  if (!data.email || data.email.trim() === '') {
    errors.email = ['Email is required'];
  } else if (!validateEmail(data.email)) {
    errors.email = ['Invalid email format'];
  }
  
  if (!data.message || data.message.trim() === '') {
    errors.message = ['Message is required'];
  } else if (data.message.length > 1000) {
    errors.message = ['Message is too long (max 1000 characters)'];
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors: errors
  };
};

// API handler with authentication and validation
async function handler(req: NextRequest, data: ExampleRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return createErrorResponse('Unauthorized', 401);
    }
    
    // Process the validated data
    console.log(`Processing request from ${session.user?.email}:`, data);
    
    // Respond with success
    return NextResponse.json({
      success: true,
      message: 'Request processed successfully',
      data: {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        requestData: data
      }
    });
  } catch (error) {
    console.error('Error in secure API:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// Apply rate limiting and validation middleware
export const POST = rateLimit(
  validateRequestBody<ExampleRequest>(handler, validateExample),
  { maxRequests: 10, windowMs: 60 * 1000 } // 10 requests per minute
); 