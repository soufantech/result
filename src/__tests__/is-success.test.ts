import { success, failure } from '..';

test('isSuccess returns true when invoked on success result.', () => {
  const result = success('ay');

  expect(result.isSuccess()).toBe(true);
});

test('isSuccess returns false when invoked on failure result.', () => {
  const result = failure('nay');

  expect(result.isSuccess()).toBe(false);
});
