import { POST as UploadPOST } from '@/app/api/upload/route';

// Mock next-auth getServerSession for this route (it imports from 'next-auth/next')
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn().mockResolvedValue(null),
}));

describe('Upload API security', () => {
  const url = 'https://example.com/api/upload';

  it('rejects when not admin (no session)', async () => {
    const req: any = { method: 'POST', url, headers: new Headers() };
    const res = await UploadPOST(req);
    expect(res.status).toBe(403);
  });
});

