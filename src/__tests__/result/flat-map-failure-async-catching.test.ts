import { success, failure } from '../..';

beforeEach(() => {
  jest.clearAllMocks();
});

const f = jest.fn<string, [string]>((s: string) => `f(${s})`);
const g = jest.fn<string, [string]>((s: string) => `g(${s})`);

class AError extends Error {}
class BError extends Error {}
class CError extends Error {}
class RejectedError extends Error {}

test('flatMapFailureAsyncCatching maps a failure with mapFn returning a Promise with a Result.', async () => {
  const result = await failure<unknown, AError>(
    new AError('nay'),
  ).flatMapFailureAsyncCatching<BError>((e) =>
    Promise.resolve(failure<unknown, BError>(new BError(f(e.message)))),
  );

  expect(result.isFailure()).toBe(true);
  expect(result.get()).toBeInstanceOf(BError);
  expect((result.get() as Error).message).toBe('f(nay)');
});

test('flatMapFailureAsyncCatching maps a failure handling the rejected Promise from mapFn.', async () => {
  const result = await failure<unknown, AError>(
    new AError('nay'),
  ).flatMapFailureAsyncCatching<BError>((e) =>
    Promise.reject(new RejectedError(f(e.message))),
  );

  expect(result.isFailure()).toBe(true);
  expect(result.get()).toBeInstanceOf(RejectedError);
  expect((result.get() as Error).message).toBe('f(nay)');
});

test('flatMapFailureAsyncCatching maps a failure with mapFn returning a ResultPromise.', async () => {
  const result = await failure<string, AError>(
    new AError('nay'),
  ).flatMapFailureAsyncCatching<CError>((errA) =>
    failure<string, BError>(
      new BError(f(errA.message)),
    ).flatMapFailureAsync((errB) =>
      Promise.resolve(failure(new CError(g(errB.message)))),
    ),
  );

  expect(result.isFailure()).toBe(true);
  expect(result.get()).toBeInstanceOf(CError);
  expect((result.get() as Error).message).toBe('g(f(nay))');
});

test('flatMapFailureAsyncCatching maps a success bypassing mapFn.', async () => {
  const result = await success<string, Error>(
    'ay',
  ).flatMapFailureAsyncCatching((e) =>
    Promise.resolve(failure(new Error(f(e.message)))),
  );

  expect(result.isSuccess()).toBe(true);
  expect(result.get()).toBe('ay');
  expect(f).not.toHaveBeenCalled();
});
