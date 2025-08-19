import { POST as ResizePOST } from '@/app/api/resize-image/route';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn().mockResolvedValue({ user: { isAdmin: true } }),
}));

describe('Resize-image security', () => {
  const makeFormData = (fields: Record<string, string>) => {
    const form = new FormData();
    for (const [k, v] of Object.entries(fields)) form.append(k, v);
    return form;
  };

  it('rejects non-https URLs in production', async () => {
    const req: any = {
      method: 'POST',
      url: 'https://example.com/api/resize-image',
      formData: async () => makeFormData({ imageUrl: 'http://insecure.example/image.jpg' }),
      headers: new Headers(),
    };
    const prevEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const res = await ResizePOST(req);
    process.env.NODE_ENV = prevEnv;
    expect(res.status).toBe(400);
  });
});

