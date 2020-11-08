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
  expect((result.get() as Error).message).toBe('nay');
  expect(failureCb).toHaveBeenCalledWith(err);
});

test('onFailure is NOT called on a success Result.', async () => {
  const result = await success<string, Error>('ay')
    .toResultPromise()
    .onFailure(failureCb);

  expect(result.isSuccess()).toBe(true);
  expect(result.get()).toBe('ay');
  expect(failureCb).not.toHaveBeenCalled();
});
