import { success, failure } from '../..';

test('getOrNull returns the encapsulated value when invoked on success Result.', async () => {
  const result = success('ay').toResultPromise();

  expect(result.getOrNull()).resolves.toBe('ay');
});

test('getOrNull returns null when invoked on failure Result.', async () => {
  const result = failure(new Error('nay')).toResultPromise();

  expect(result.getOrNull()).resolves.toBeNull();
});
