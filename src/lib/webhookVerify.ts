import crypto from 'crypto';

export type Provider = 'generic' | 'stripe';

function hmacSHA256Hex(message: string | Buffer, secret: string) {
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

function timingSafeEqualHex(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, 'hex');
  const bBuf = Buffer.from(b, 'hex');
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export interface VerifyOptions {
  headerName?: string; // for generic, default 'x-signature'
  timestampHeader?: string; // for generic, default 'x-timestamp'
  toleranceSeconds?: number; // default 300
}

export function verifyGeneric(headers: Headers, rawBody: string | Buffer, secret: string, opts: VerifyOptions = {}): boolean {
  const headerName = (opts.headerName || 'x-signature').toLowerCase();
  const tsHeader = (opts.timestampHeader || 'x-timestamp').toLowerCase();
  const tolerance = opts.toleranceSeconds ?? Number(process.env.WEBHOOK_TOLERANCE_SECONDS || 300);

  const sig = headers.get(headerName);
  const ts = headers.get(tsHeader);
  if (!sig || !ts) return false;
  const tsNum = Number(ts);
  if (!Number.isFinite(tsNum)) return false;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - tsNum) > tolerance) return false;

  const payload = `${ts}.${typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8')}`;
  const expected = hmacSHA256Hex(payload, secret);
  return timingSafeEqualHex(expected, sig);
}

// Stripe-like scheme: header 'Stripe-Signature': t=timestamp,v1=signature
export function verifyStripe(headers: Headers, rawBody: string | Buffer, secret: string, opts: VerifyOptions = {}): boolean {
  const tolerance = opts.toleranceSeconds ?? Number(process.env.WEBHOOK_TOLERANCE_SECONDS || 300);
  const sigHeader = headers.get('stripe-signature');
  if (!sigHeader) return false;
  const parts = Object.fromEntries(sigHeader.split(',').map((kv) => kv.split('=')));
  const t = Number(parts['t']);
  const v1 = parts['v1'];
  if (!t || !v1) return false;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - t) > tolerance) return false;
  const payload = `${t}.${typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8')}`;
  const expected = hmacSHA256Hex(payload, secret);
  return timingSafeEqualHex(expected, v1);
}

export function verifyWebhookRequest(provider: Provider, headers: Headers, rawBody: string | Buffer, secret: string, opts: VerifyOptions = {}): boolean {
  if (!secret) return false;
  if (provider === 'stripe') return verifyStripe(headers, rawBody, secret, opts);
  return verifyGeneric(headers, rawBody, secret, opts);
}

/*
Usage example in an App Router route:

export async function POST(req: NextRequest) {
  const raw = await req.text(); // get raw body BEFORE parsing JSON
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;
  const ok = verifyWebhookRequest('stripe', req.headers, raw, secret);
  if (!ok) return new NextResponse('Invalid signature', { status: 400 });

  const event = JSON.parse(raw);
  // handle event...
  return NextResponse.json({ received: true });
}
*/

