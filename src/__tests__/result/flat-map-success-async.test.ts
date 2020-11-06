import { success, failure } from '../..';

beforeEach(() => {
  jest.clearAllMocks();
});

const f = jest.fn<string, [string]>((s: string) => `f(${s})`);
const g = jest.fn<string, [string]>((s: string) => `g(${s})`);

test('flatMapSuccessAsync maps a success with mapFn returning a Promise with a Result.', async () => {
  const result = await success('ay').flatMapSuccessAsync((s) =>
    Promise.resolve(success(f(s))),
  );

  expect(result.isSuccess()).toBe(true);
  expect(result.get()).toBe('f(ay)');
});

test('flatMapSuccessAsync maps a success with mapFn returning a PromiseResult.', async () => {
  const result = await success('ay').flatMapSuccessAsync((s) =>
    success(f(s)).flatMapSuccessAsync((s2) => Promise.resolve(success(g(s2)))),
  );

  expect(result.isSuccess()).toBe(true);
  expect(result.get()).toBe('g(f(ay))');
});

test('flatMapSuccessAsync maps a failure bypassing mapFn.', async () => {
  const error = new Error('nay');

  const result = await failure<string, Error>(error).flatMapSuccessAsync((s) =>
    Promise.resolve(success(f(s))),
  );

  expect(result.isFailure()).toBe(true);
  expect(result.get()).toBeInstanceOf(Error);
  expect((result.get() as Error).message).toBe('nay');
  expect(f).not.toHaveBeenCalled();
});
