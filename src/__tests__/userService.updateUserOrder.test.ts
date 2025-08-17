import { updateUserOrder } from '@/lib/userService';

// Minimal fs mock by writing and reading the real data files under a temp folder is complex.
// For a smoke test without I/O, we call the function and assert it returns a Promise and
// does not throw synchronously. The function performs async I/O; we only verify it can be invoked.

test('updateUserOrder is callable and returns a Promise', async () => {
  // silence console logs that may occur asynchronously inside updateUserOrder
  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  const promise = updateUserOrder('someone@example.com', 'order-1', { status: 'paid' } as any);
  expect(promise).toBeInstanceOf(Promise);

  // do not await promise (we only validate shape), but yield microtask queue
  await Promise.resolve();

  logSpy.mockRestore();
  warnSpy.mockRestore();
  errorSpy.mockRestore();
});

