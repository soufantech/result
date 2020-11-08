import { success, failure } from '../..';

beforeEach(() => {
  jest.clearAllMocks();
});

const failureCb = jest.fn<void, [Error]>(() => {
  return;
});

test('onFailure is called on a failure Result.', () => {
  const err = new Error('nay');

  const result = failure(err).onFailure(failureCb);

  expect(result.isFailure()).toBe(true);
  expect((result.get() as Error).message).toBe('nay');
  expect(failureCb).toHaveBeenCalledWith(err);
});

test('onFailure is NOT called on a success Result.', () => {
  const result = success<string, Error>('ay').onFailure(failureCb);

  expect(result.isSuccess()).toBe(true);
  expect(result.get()).toBe('ay');
  expect(failureCb).not.toHaveBeenCalled();
});
