import { success, failure } from '../..';

beforeEach(() => {
  jest.clearAllMocks();
});

const failureCb = jest.fn<void, [Error]>(() => {
  return;
});

test('onFailure is called on a failure Result.', async () => {
  const err = new Error('nay');

  const result = await failure(err).toResultPromise().onFailure(failureCb);

  expect(result.isFailure()).toBe(true);

  if (result.isFailure()) {
    expect(result.get().message).toBe('nay');
  }

  expect(failureCb).toHaveBeenCalledWith(err);
});

test('onFailure is NOT called on a success Result.', async () => {
  const result = await success<string, Error>('ay')
    .toResultPromise()
    .onFailure(failureCb);

  expect(result.isSuccess()).toBe(true);

  if (result.isSuccess()) {
    expect(result.get()).toBe('ay');
  }

  expect(failureCb).not.toHaveBeenCalled();
});
