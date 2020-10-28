import { success, failure } from '..';

beforeEach(() => {
  jest.clearAllMocks();
});

const f = jest.fn<string, [string]>((s: string) => `f(${s})`);
const g = jest.fn<string, [string]>((s: string) => `g(${s})`);

test('mapSuccess returns mapped value of success result.', () => {
  const result = success('ay').mapSuccess(f).mapSuccess(g);

  expect(result.isSuccess()).toBe(true);
  expect(result.get()).toBe('g(f(ay))');
});

test('mapSuccess forwards a failure result.', () => {
  const error = new Error('nay');

  const result = failure<string, Error>(error).mapSuccess(f).mapSuccess(g);

  expect(result.isFailure()).toBe(true);
  expect(result.get()).toBe(error);

  expect(f).not.toHaveBeenCalled();
  expect(g).not.toHaveBeenCalled();
});
