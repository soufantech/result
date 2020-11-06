import { success, failure } from '../..';

test('getOrDefault returns the encapsulated value when invoked on success Result.', async () => {
  const result = success('ay').toResultPromise();

  expect(result.getOrDefault('ray')).resolves.toBe('ay');
});

test('getOrDefault returns the default value when invoked on failure Result.', async () => {
  const result = failure(new Error('nay')).toResultPromise();

  expect(result.getOrDefault('ray')).resolves.toBe('ray');
});
