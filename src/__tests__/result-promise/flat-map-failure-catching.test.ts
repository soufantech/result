import { success, failure } from '../..';

beforeEach(() => {
  jest.clearAllMocks();
});

const f = jest.fn<string, [string]>((s: string) => `f(${s})`);
const g = jest.fn<string, [string]>((s: string) => `g(${s})`);

class AError extends Error {}
class BError extends Error {}

test('flatMapFailureCatching returns the Result instance returned by the mapping function.', async () => {
  const result = await failure<number, Error>(new Error('nay'))
    .toResultPromise()
    .flatMapFailureCatching<AError>((e) =>
      failure(new AError(f(String(e.message)))),
    )
    .flatMapFailureCatching<BError>((e) =>
      failure(new BError(g(String(e.message)))),
    );

  expect(result.isFailure()).toBe(true);

  if (result.isFailure()) {
    expect(result.get()).toBeInstanceOf(BError);
    expect(result.get().message).toBe('g(f(nay))');
  }
});

test('flatMapFailureCatching returns the Result instance returned by the mapping function catching.', async () => {
  const result = await failure<number, Error>(new Error('nay'))
    .toResultPromise()
    .flatMapFailureCatching<AError>((e) => {
      throw new AError(f(String(e.message))); // Throw!
    })
    .flatMapFailureCatching<BError>((e) =>
      failure(new BError(g(String(e.message)))),
    );

  expect(result.isFailure()).toBe(true);

  if (result.isFailure()) {
    expect(result.get()).toBeInstanceOf(BError);
    expect(result.get().message).toBe('g(f(nay))');
  }
});

test('flatMapFailureCatching forwards a success result.', async () => {
  const result = await success<string, Error>('ay')
    .toResultPromise()
    .flatMapFailureCatching((e) => failure(new AError(f(String(e.message)))))
    .flatMapFailureCatching((e) => failure(new BError(g(String(e.message)))));

  expect(result.isSuccess()).toBe(true);

  if (result.isSuccess()) {
    expect(result.get()).toBe('ay');
  }

  expect(f).not.toHaveBeenCalled();
  expect(g).not.toHaveBeenCalled();
});
