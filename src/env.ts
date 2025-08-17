import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NEXTAUTH_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    UPDATE_PURCHASES_AUTH_KEY: z.string().optional(),
    ASSET_PREFIX: z.string().url().optional(),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    ADMIN_EMAILS: z.string().optional(),
    STRICT_CSP_STYLES: z.enum(['true', 'false']).optional(),
  },
  client: {
    NEXT_PUBLIC_EXPORT: z.enum(['true', 'false']).optional(),
  },
  runtimeEnv: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    UPDATE_PURCHASES_AUTH_KEY: process.env.UPDATE_PURCHASES_AUTH_KEY,
    ASSET_PREFIX: process.env.ASSET_PREFIX,
    NODE_ENV: process.env.NODE_ENV,
    ADMIN_EMAILS: process.env.ADMIN_EMAILS,
    NEXT_PUBLIC_EXPORT: process.env.NEXT_PUBLIC_EXPORT,
    STRICT_CSP_STYLES: process.env.STRICT_CSP_STYLES,
  },
});

