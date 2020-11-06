import { success, failure } from '../..';

beforeEach(() => {
  jest.clearAllMocks();
});

const getErrorMessage = jest.fn<string, [Error]>((err) => {
  return err.message;
});

test('getOrElse returns the encapsulated value when invoked on success Result.', () => {
  const result = success<string, Error>('ay');

  expect(result.isSuccess()).toBe(true);
  expect(result.getOrElse(getErrorMessage)).toBe('ay');
  expect(getErrorMessage).not.toHaveBeenCalled();
});

test('getOrElse returns the value returned from the transform function when invoked on failure Result.', () => {
  const err = new Error('nay');

  const result = failure<string, Error>(err);

  expect(result.isFailure()).toBe(true);
  expect(result.getOrElse(getErrorMessage)).toBe('nay');
  expect(getErrorMessage).toHaveBeenCalledWith(err);
});
