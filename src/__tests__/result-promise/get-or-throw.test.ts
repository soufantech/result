import { success, failure } from '../..';

class SorryError extends Error {
  constructor(err: Error) {
    super(`Sorry, ${err.message}`);
  }
}

test('getOrThrow returns the encapsulated value when invoked on success Result.', () => {
  const result = success('ay');

  expect(result.isSuccess()).toBe(true);

  const value = result.getOrThrow();

  expect(value).toBe('ay');
});

test('getOrThrow returns the encapsulated value when invoked on success Result, ignoring transform function.', async () => {
  const result = success<string, Error>('ay').toResultPromise();

  const value = result.getOrThrow((err: Error) => new SorryError(err));

  expect(value).resolves.toBe('ay');
});

test('getOrThrow throws the tranformed encapsulated value when invoked on failure Result, if a transform function is provided.', async () => {
  const result = failure(new Error('nay')).toResultPromise();

  expect(
    result.getOrThrow((err: Error) => new SorryError(err)),
  ).rejects.toThrow(SorryError);
});
