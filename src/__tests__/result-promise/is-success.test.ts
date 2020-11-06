import { success, failure } from '../..';

test('isSuccess returns true when invoked on success result.', async () => {
  const result = success('ay').toResultPromise();

  expect(result.isSuccess()).resolves.toBe(true);
});

test('isSuccess returns false when invoked on failure result.', async () => {
  const result = failure('nay').toResultPromise();

  expect(result.isSuccess()).resolves.toBe(false);
});
