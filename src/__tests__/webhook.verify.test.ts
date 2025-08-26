import crypto from 'crypto';

import { verifyGeneric, verifyStripe } from '@/lib/webhookVerify';

function signHmacSHA256Hex(message: string | Buffer, secret: string) {
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

describe('Webhook verification helpers', () => {
  const secret = process.env.WEBHOOK_SECRET || 'test_secret';
  const payload = JSON.stringify({ id: 'evt_123', type: 'test.event' });
  const t = Math.floor(Date.now() / 1000);

  it('verifyGeneric passes with correct signature and timestamp', () => {
    const sig = signHmacSHA256Hex(`${t}.${payload}`, secret);
    const headers = new Headers({ 'x-signature': sig, 'x-timestamp': String(t) });
    const ok = verifyGeneric(headers as any, payload, secret);
    expect(ok).toBe(true);
  });

  it('verifyGeneric fails with wrong signature', () => {
    const headers = new Headers({ 'x-signature': 'deadbeef', 'x-timestamp': String(t) });
    const ok = verifyGeneric(headers as any, payload, secret);
    expect(ok).toBe(false);
  });

  it('verifyStripe passes with correct signature', () => {
    const sig = signHmacSHA256Hex(`${t}.${payload}`, secret);
    const headers = new Headers({ 'stripe-signature': `t=${t},v1=${sig}` });
    const ok = verifyStripe(headers as any, payload, secret);
    expect(ok).toBe(true);
  });

  it('verifyStripe fails with wrong signature', () => {
    const headers = new Headers({ 'stripe-signature': `t=${t},v1=bad` });
    const ok = verifyStripe(headers as any, payload, secret);
    expect(ok).toBe(false);
  });
});

