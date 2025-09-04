import { NextRequest } from 'next/server';

import { GET as ProductsGET } from '@/app/api/products/route';
import { GET as ProductDetailGET } from '@/app/api/products/[id]/route';
import { GET as RelatedGET } from '@/app/api/products/related/route';
import { GET as CartAddGET } from '@/app/api/cart/add/route';
import { POST as ValidateCouponPOST } from '@/app/api/validate-coupon/route';
import { GET as CouponsPublicGET } from '@/app/api/coupons/public/route';
import { GET as CartGET } from '@/app/api/cart/route';
import { POST as OrdersSavePOST } from '@/app/api/orders/save/route';
import { GET as OrdersHistoryGET } from '@/app/api/orders/history/route';

// Mặc định mock getServerSession trả về null để kiểm tra flow không đăng nhập
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn().mockResolvedValue(null),
}));

function makeNextReq(url: string, init: { method?: string; headers?: HeadersInit } = {}) {
  const headers = new Headers(init.headers || {});
  return new NextRequest(url, { method: init.method || 'GET', headers });
}

describe('API smoke tests', () => {
  // Nhóm public endpoints (không cần đăng nhập)
  describe('Public endpoints', () => {
    it('GET /api/products trả về danh sách sản phẩm', async () => {
      const req = makeNextReq('https://example.com/api/products?lang=vie');
      const res = await ProductsGET(req as any);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data)).toBe(true);
    });

    it('GET /api/products/[id] trả về chi tiết sản phẩm', async () => {
      const req = makeNextReq('https://example.com/api/products/canva?lang=vie');
      const res = await ProductDetailGET(req as any, { params: Promise.resolve({ id: 'canva' }) } as any);
      expect([200,404]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json();
        expect(json.success).toBe(true);
        expect(json.data).toBeDefined();
        expect(json.data.id || json.data.slug).toBeDefined();
      }
    });

    it('GET /api/products/related trả về danh sách liên quan', async () => {
      const req = makeNextReq('https://example.com/api/products/related?productId=canva&limit=3', {
        headers: { 'accept-language': 'vie' },
      });
      const res = await RelatedGET(req as any);
      expect(res.status).toBe(200);
      const list = await res.json();
      expect(Array.isArray(list)).toBe(true);
    });

    it('GET /api/cart/add?id=voicetyping trả về success', async () => {
      // Sử dụng sản phẩm có trong mockData.ts (id/slug: voicetyping)
      const req = new Request('https://example.com/api/cart/add?id=voicetyping', { method: 'GET' });
      const res = await CartAddGET(req as any);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
    });

    it('POST /api/validate-coupon trả về kết quả hợp lệ (file có thể tồn tại/không)', async () => {
      const req = new Request('https://example.com/api/validate-coupon', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code: 'TEST', total: 100000 }),
      });
      const res = await ValidateCouponPOST(req as any);
      expect(res.status).toBe(200);
      const json = await res.json();
      // Nếu không có file coupons -> NO_COUPON_FILE
      // Nếu có file nhưng code không tồn tại -> NOT_FOUND_OR_INACTIVE
      if (json.valid === false) {
        expect(['NO_COUPON_FILE', 'NOT_FOUND_OR_INACTIVE']).toContain(json.reason);
      }
    });

    it('GET /api/coupons/public trả về danh sách (có thể rỗng)', async () => {
      const req = makeNextReq('https://example.com/api/coupons/public');
      const res = await CouponsPublicGET(req as any);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.coupons)).toBe(true);
    });
  });

  // Nhóm protected endpoints (khi không đăng nhập phải bị chặn)
  describe('Protected endpoints (unauthenticated)', () => {
    it('GET /api/cart trả về 401 khi chưa đăng nhập', async () => {
      const req = new Request('https://example.com/api/cart');
      const res = await CartGET(req as any);
      expect(res.status).toBe(401);
    });

    it('POST /api/orders/save trả về 401 khi chưa đăng nhập', async () => {
      const req = new Request('https://example.com/api/orders/save', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: 'ORD-1', items: [] }),
      });
      const res = await OrdersSavePOST(req as any);
      expect(res.status).toBe(401);
    });

    it('GET /api/orders/history trả về 401 khi chưa đăng nhập', async () => {
      const res = await OrdersHistoryGET();
      expect(res.status).toBe(401);
    });
  });
});
