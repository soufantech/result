import { success, failure } from '..';

test('getOrDefault returns the encapsulated value when invoked on success Result.', () => {
  const result = success('ay');

  expect(result.isSuccess()).toBe(true);
  expect(result.getOrDefault('ray')).toBe('ay');
});

test('getOrDefault returns the default value when invoked on failure Result.', () => {
  const result = failure(new Error('nay'));

  expect(result.isFailure()).toBe(true);
  expect(result.getOrDefault('ray')).toBe('ray');
});
