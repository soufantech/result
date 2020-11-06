import { success, failure } from '../..';

beforeEach(() => {
  jest.clearAllMocks();
});

class RecoveringError extends Error {}

const recoverer = jest.fn<string, [Error]>((err) => {
  return `recovered(${err.message})`;
});

const throwingRecoverer = jest.fn<string, [Error]>((err) => {
  throw new RecoveringError(err.message);
});

test('recoverCatching has no effect on a success Result.', async () => {
  const result = await success<string, Error>('ay')
    .toResultPromise()
    .recoverCatching(recoverer);

  expect(result.isSuccess()).toBe(true);
  expect(result.getOrThrow()).toBe('ay');
  expect(recoverer).not.toHaveBeenCalled();
});

test('recoverCatching returns the value returned from the transform function in a new Result when invoked on failure Result.', async () => {
  const err = new Error('nay');

  const result = await failure<string, Error>(err)
    .toResultPromise()
    .recoverCatching(recoverer);

  expect(result.isSuccess()).toBe(true);

  expect(result.getOrThrow()).toBe('recovered(nay)');
  expect(recoverer).toHaveBeenCalledWith(err);
});

test('recoverCatching returns a failure Result with the Error instance thrown by the transform function invoked on failure Result.', async () => {
  const err = new Error('nay');

  const result = await failure<string, Error>(err)
    .toResultPromise()
    .recoverCatching(throwingRecoverer);

  expect(result.isFailure()).toBe(true);

  expect(() => {
    result.getOrThrow();
  }).toThrowError(RecoveringError);

  expect(throwingRecoverer).toHaveBeenCalledWith(err);
});
