import { success, failure } from '../..';

beforeEach(() => {
  jest.clearAllMocks();
});

const f = jest.fn<string, [string]>((s: string) => `f(${s})`);
const g = jest.fn<string, [string]>((s: string) => `g(${s})`);

class AError extends Error {}
class BError extends Error {}
class CError extends Error {}

test('flatMapFailureAsync maps a failure with mapFn returning a Promise with a Result.', async () => {
  const result = await failure<unknown, AError>(
    new AError('nay'),
  ).flatMapFailureAsync<BError>((e) =>
    Promise.resolve(failure<unknown, BError>(new BError(f(e.message)))),
  );

  expect(result.isFailure()).toBe(true);
  expect(result.get()).toBeInstanceOf(BError);
  expect((result.get() as Error).message).toBe('f(nay)');
});

test('flatMapFailureAsync maps a failure with mapFn returning a ResultPromise.', async () => {
  const result = await failure<string, AError>(
    new AError('nay'),
  ).flatMapFailureAsync<CError>((errA) =>
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

test('flatMapFailureAsync maps a success bypassing mapFn.', async () => {
  const result = await success<string, Error>('ay').flatMapFailureAsync((e) =>
    Promise.resolve(failure(new Error(f(e.message)))),
  );

  expect(result.isSuccess()).toBe(true);
  expect(result.get()).toBe('ay');
  expect(f).not.toHaveBeenCalled();
});
