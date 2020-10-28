import { success, failure } from '..';

test('getOrNull returns the encapsulated value when invoked on success Result.', () => {
  const result = success('ay');

  expect(result.isSuccess()).toBe(true);
  expect(result.getOrNull()).toBe('ay');
});

test('getOrNull returns null when invoked on failure Result.', () => {
  const result = failure(new Error('nay'));

  expect(result.isFailure()).toBe(true);
  expect(result.getOrNull()).toBeNull();
});
