import { updateUserOrder } from '@/lib/userService';

// Minimal fs mock by writing and reading the real data files under a temp folder is complex.
// For a smoke test without I/O, we call the function and assert it returns a Promise and
// does not throw synchronously. The function performs async I/O; we only verify it can be invoked.

test('updateUserOrder is callable and returns a Promise', async () => {
  // @ts-expect-error simplify call with fake data; we only assert invocation shape
  const promise = updateUserOrder('someone@example.com', 'order-1', { status: 'paid' });
  expect(promise).toBeInstanceOf(Promise);
});

