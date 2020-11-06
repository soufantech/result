import { success, failure } from '../..';

test('getOrUndefined returns the encapsulated value when invoked on success Result.', () => {
  const result = success('ay');

  expect(result.isSuccess()).toBe(true);
  expect(result.getOrUndefined()).toBe('ay');
});

test('getOrUndefined returns undefined when invoked on failure Result.', () => {
  const result = failure(new Error('nay'));

  expect(result.isFailure()).toBe(true);
  expect(result.getOrUndefined()).toBeUndefined();
});
