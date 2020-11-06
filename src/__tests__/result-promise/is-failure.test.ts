import { success, failure } from '../..';

test('isFailure returns true when invoked on failure result.', async () => {
  const result = failure('nay').toResultPromise();

  expect(result.isFailure()).resolves.toBe(true);
});

test('isFailure returns false when invoked on success result.', async () => {
  const result = success('ay').toResultPromise();

  expect(result.isFailure()).resolves.toBe(false);
});
