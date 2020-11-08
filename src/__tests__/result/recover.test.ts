import { success, failure } from '../..';

beforeEach(() => {
  jest.clearAllMocks();
});

const recoverer = jest.fn<string, [Error]>((err) => {
  return `recovered(${err.message})`;
});

test('recover has no effect on a success Result.', () => {
  const result = success<string, Error>('ay').recover(recoverer);

  expect(result.isSuccess()).toBe(true);
  expect(result.getOrThrow()).toBe('ay');
  expect(recoverer).not.toHaveBeenCalled();
});

test('recover returns the value returned from the transform function in a new Result when invoked on failure Result.', () => {
  const err = new Error('nay');

  const result = failure<string, Error>(err).recover(recoverer);

  expect(result.isSuccess()).toBe(true);
  expect(result.getOrThrow()).toBe('recovered(nay)');
  expect(recoverer).toHaveBeenCalledWith(err);
});
