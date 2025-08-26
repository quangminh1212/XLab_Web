import { NextRequest, NextResponse } from 'next/server';

import { verifyWebhookRequest } from '@/lib/webhookVerify';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const provider = (process.env.WEBHOOK_PROVIDER || 'generic') as 'generic' | 'stripe';
  const secret = process.env.WEBHOOK_SECRET || '';
  const raw = await req.text();

  const ok = verifyWebhookRequest(provider, req.headers, raw, secret);
  if (!ok) {
    console.error('[Webhook] Invalid signature');
    return new NextResponse('Invalid signature', { status: 400 });
  }

  try {
    const event = JSON.parse(raw || '{}');
    // TODO: handle event types here
    return NextResponse.json({ received: true });
  } catch (e) {
    console.error('[Webhook] Error parsing payload', e);
    return new NextResponse('Bad Request', { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

