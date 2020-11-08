import { success, failure } from '../..';

beforeEach(() => {
  jest.clearAllMocks();
});

const f = jest.fn<string, [string]>((s: string) => `f(${s})`);
const g = jest.fn<string, [string]>((s: string) => `g(${s})`);

class AError extends Error {}
class BError extends Error {}

test('flatMapFailure returns the Result instance returned by the mapping function.', () => {
  const result = failure<number, Error>(new Error('nay'))
    .flatMapFailure((e) => failure(new AError(f(String(e.message)))))
    .flatMapFailure((e) => failure(new BError(g(String(e.message)))));

  expect(result.isFailure()).toBe(true);
  expect(result.get()).toBeInstanceOf(BError);
  expect((result.get() as Error).message).toBe('g(f(nay))');
});

test('flatMapFailure forwards a success result.', () => {
  const result = success<string, Error>('ay')
    .flatMapFailure((e) => failure(new AError(f(String(e.message)))))
    .flatMapFailure((e) => failure(new BError(g(String(e.message)))));

  expect(result.isSuccess()).toBe(true);
  expect(result.get()).toBe('ay');
  expect(f).not.toHaveBeenCalled();
  expect(g).not.toHaveBeenCalled();
});
