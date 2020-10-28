import { success, failure } from '..';

beforeEach(() => {
  jest.clearAllMocks();
});

const onFailure = jest.fn<string, [Error]>(
  (err: Error) => `onFailure(${err.message})`,
);
const onSuccess = jest.fn<string, [string]>((s: string) => `onSuccess(${s})`);

test('fold returns the value returned from the onSuccess function on success Result.', () => {
  const foldedStr = success<string, Error>('ay').fold<string>(
    onSuccess,
    onFailure,
  );

  expect(foldedStr).toBe('onSuccess(ay)');

  expect(onSuccess).toHaveBeenCalledWith('ay');
  expect(onFailure).not.toHaveBeenCalled();
});

test('fold returns the value returned from the onFailure function on failure Result.', () => {
  const err = new Error('nay');

  const foldedStr = failure<string, Error>(err).fold<string>(
    onSuccess,
    onFailure,
  );

  expect(foldedStr).toBe('onFailure(nay)');

  expect(onFailure).toHaveBeenCalledWith(err);
  expect(onSuccess).not.toHaveBeenCalled();
});
