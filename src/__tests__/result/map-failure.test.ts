import { success, failure } from '../..';

beforeEach(() => {
  jest.clearAllMocks();
});

class TopError extends Error {}
class TopTopError extends TopError {}

const f = jest.fn<string, [string]>((s: string) => `f(${s})`);
const g = jest.fn<string, [string]>((s: string) => `g(${s})`);

test('mapFailure returns mapped value of failure result.', () => {
  const result = failure('nay')
    .mapFailure((msg) => new Error(msg))
    .mapFailure((e) => new TopError(f(e.message)))
    .mapFailure((e) => new TopTopError(g(e.message)));

  expect.assertions(3);
  expect(result.isFailure()).toBe(true);

  // This conditional is here just to satisfy the TS typesystem checks.
  if (result.isFailure()) {
    const err = result.get();

    expect(err.message).toBe('g(f(nay))');
    expect(err).toBeInstanceOf(TopTopError);
  }
});

test('mapFailure forwards a success result.', () => {
  const result = success<string, string>('ay')
    .mapFailure((msg) => new Error(msg))
    .mapFailure((e) => new TopError(f(e.message)))
    .mapFailure((e) => new TopTopError(g(e.message)));

  expect.assertions(4);

  expect(result.isSuccess()).toBe(true);

  // This conditional is here just to satisfy the TS typesystem checks.
  if (result.isSuccess()) {
    const ok = result.get();

    expect(ok).toBe('ay');
  }

  expect(f).not.toHaveBeenCalled();
  expect(g).not.toHaveBeenCalled();
});
