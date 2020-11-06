import { success, failure } from '../..';

test('isFailure returns true when invoked on failure result.', () => {
  const result = failure('nay');

  expect(result.isFailure()).toBe(true);
});

test('isFailure returns false when invoked on success result.', () => {
  const result = success('ay');

  expect(result.isFailure()).toBe(false);
});
