import { success, failure } from '../..';

function getErrorMessage(err: Error) {
  return err.message;
}

test('getOrElse returns the encapsulated value when invoked on success Result.', async () => {
  const result = success<string, Error>('ay').toResultPromise();

  expect(result.getOrElse(getErrorMessage)).resolves.toBe('ay');
});

test('getOrElse returns the value returned from the transform function when invoked on failure Result.', async () => {
  const err = new Error('nay');

  const result = failure<string, Error>(err).toResultPromise();

  expect(result.getOrElse(getErrorMessage)).resolves.toBe('nay');
});
