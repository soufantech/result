import { success, failure } from '../..';

beforeEach(() => {
  jest.clearAllMocks();
});

class TopError extends Error {}
class TopTopError extends TopError {}

const f = jest.fn<string, [string]>((s: string) => `f(${s})`);
const g = jest.fn<string, [string]>((s: string) => `g(${s})`);

test('mapFailure returns mapped value of failure result.', async () => {
  const result = await failure('nay')
    .toResultPromise()
    .mapFailure((msg) => new Error(msg))
    .mapFailure((e) => new TopError(f(e.message)))
    .mapFailure((e) => new TopTopError(g(e.message)));

  const err = result.get() as Error;

  expect(result.isFailure()).toBe(true);
  expect(err.message).toBe('g(f(nay))');
  expect(err).toBeInstanceOf(TopTopError);
});

test('mapFailure forwards a success result.', async () => {
  const result = await success<string, string>('ay')
    .toResultPromise()
    .mapFailure((msg) => new Error(msg))
    .mapFailure((e) => new TopError(f(e.message)))
    .mapFailure((e) => new TopTopError(g(e.message)));

  const ok = result.get();

  expect(ok).toBe('ay');
  expect(result.isSuccess()).toBe(true);
  expect(f).not.toHaveBeenCalled();
  expect(g).not.toHaveBeenCalled();
});
