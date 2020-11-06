import { success, failure } from '../..';

beforeEach(() => {
  jest.clearAllMocks();
});

const f = jest.fn<string, [string]>((s: string) => `f(${s})`);

class RejectedError extends Error {}

test('mapSuccessAsyncCatching maps a success with mapFn returning a Promise with a value.', async () => {
  const result = await success('ay').mapSuccessAsyncCatching((s) =>
    Promise.resolve(s).then(f),
  );

  expect(result.isSuccess()).toBe(true);
  expect(result.get()).toBe('f(ay)');
});

test('mapSuccessAsyncCatching maps a success handling the rejected Promise from mapFn.', async () => {
  const result = await success<string, string>('ay').mapSuccessAsyncCatching<
    string
  >((s) => Promise.reject(new RejectedError(f(s))));

  expect(result.isFailure()).toBe(true);
  expect(result.get()).toBeInstanceOf(RejectedError);
  expect((result.get() as Error).message).toBe('f(ay)');
});

test('mapSuccessAsyncCatching maps a failure bypassing mapFn.', async () => {
  const error = new Error('nay');

  const result = await failure<string, Error>(
    error,
  ).mapSuccessAsyncCatching((s) => Promise.resolve(s).then(f));

  expect(result.isFailure()).toBe(true);
  expect(result.get()).toBe(error);
  expect(f).not.toHaveBeenCalled();
});
