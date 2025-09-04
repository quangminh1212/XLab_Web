import { NextRequest } from 'next/server';

// Mock both next-auth modules used across routes
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

import * as NextAuthNext from 'next-auth/next';
import * as NextAuth from 'next-auth';

import { GET as AdminProductsGET } from '@/app/api/admin/products/route';
import { GET as AdminProductDetailGET } from '@/app/api/admin/products/[id]/route';
import { GET as AdminCouponsGET } from '@/app/api/admin/coupons/route';
import { GET as AdminNotificationsGET } from '@/app/api/admin/notifications/route';
import { GET as AdminSettingsGET } from '@/app/api/admin/settings/route';

function makeReq(url: string, init: { method?: string; headers?: HeadersInit } = {}) {
  const headers = new Headers(init.headers || {});
  return new NextRequest(url, { method: init.method || 'GET', headers });
}

describe('Admin API smoke tests', () => {
  const adminSession = { user: { email: 'admin@example.com', isAdmin: true } } as any;
  const userSession = { user: { email: 'user@example.com', isAdmin: false } } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('GET /api/admin/products requires admin (401 when not admin)', async () => {
    (NextAuthNext.getServerSession as jest.Mock).mockResolvedValue(userSession);
    const req = makeReq('https://example.com/api/admin/products', { headers: { 'accept-language': 'vi-VN' } });
    const res = await AdminProductsGET(req as any);
    expect(res.status).toBe(401);
  });

  it('GET /api/admin/products returns list for admin', async () => {
    (NextAuthNext.getServerSession as jest.Mock).mockResolvedValue(adminSession);
    const req = makeReq('https://example.com/api/admin/products', { headers: { 'accept-language': 'vi-VN' } });
    const res = await AdminProductsGET(req as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json)).toBe(true);
  });

  it('GET /api/admin/products/[id] returns product detail for admin', async () => {
    (NextAuthNext.getServerSession as jest.Mock).mockResolvedValue(adminSession);
    const req = makeReq('https://example.com/api/admin/products/canva', { headers: { 'accept-language': 'vi-VN' } });
    const res = await AdminProductDetailGET(req as any, { params: Promise.resolve({ id: 'canva' }) } as any);
    expect([200,404]).toContain(res.status);
  });

  it('GET /api/admin/coupons requires admin (403 when not admin)', async () => {
    (NextAuth.getServerSession as jest.Mock).mockResolvedValue(userSession);
    const req = makeReq('https://example.com/api/admin/coupons');
    const res = await AdminCouponsGET(req as any);
    expect(res.status).toBe(403);
  });

  it('GET /api/admin/coupons returns list for admin', async () => {
    (NextAuth.getServerSession as jest.Mock).mockResolvedValue(adminSession);
    const req = makeReq('https://example.com/api/admin/coupons');
    const res = await AdminCouponsGET(req as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.coupons)).toBe(true);
  });

  it('GET /api/admin/notifications returns list for admin', async () => {
    (NextAuth.getServerSession as jest.Mock).mockResolvedValue(adminSession);
    const req = makeReq('https://example.com/api/admin/notifications');
    const res = await AdminNotificationsGET(req as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.notifications)).toBe(true);
  });

  it('GET /api/admin/settings returns current settings for admin', async () => {
    (NextAuthNext.getServerSession as jest.Mock).mockResolvedValue(adminSession);
    const res = await AdminSettingsGET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toBeDefined();
    // Có các trường mặc định nằm trong nhánh site
    expect(json).toHaveProperty('site.siteName');
  });
});
