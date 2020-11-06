import { success, failure } from '../..';

test('getOrUndefined returns the encapsulated value when invoked on success Result.', async () => {
  const result = success('ay').toResultPromise();

  expect(result.getOrUndefined()).resolves.toBe('ay');
});

test('getOrUndefined returns undefined when invoked on failure Result.', async () => {
  const result = failure(new Error('nay')).toResultPromise();

  expect(result.getOrUndefined()).resolves.toBeUndefined();
});
