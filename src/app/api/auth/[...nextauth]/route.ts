import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';


// Set this route to be dynamically rendered at request time
export const dynamic = "force-dynamic";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
