import { success, failure } from '../..';

beforeEach(() => {
  jest.clearAllMocks();
});

const successCb = jest.fn<void, [string]>(() => {
  return;
});

test('onSuccess is called on a success Result.', async () => {
  const result = await success('ay').toResultPromise().onSuccess(successCb);

  expect(result.isSuccess()).toBe(true);

  if (result.isSuccess()) {
    expect(result.get()).toBe('ay');
  }

  expect(successCb).toHaveBeenCalledWith('ay');
});

test('onSuccess is NOT called on a failure Result.', async () => {
  const err = new Error('nay');

  const result = await failure<string, Error>(err)
    .toResultPromise()
    .onSuccess(successCb);

  expect(result.isFailure()).toBe(true);

  if (result.isFailure()) {
    expect(result.get()).toBe(err);
  }

  expect(successCb).not.toHaveBeenCalled();
});
