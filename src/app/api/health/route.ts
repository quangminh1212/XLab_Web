import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const now = new Date().toISOString();
    return NextResponse.json({ status: 'healthy', time: now }, { status: 200 });
  } catch {
    return NextResponse.json({ status: 'unhealthy' }, { status: 500 });
  }
}
