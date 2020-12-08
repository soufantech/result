import { success, failure } from '..';

beforeEach(() => {
  jest.clearAllMocks();
});

const successCb = jest.fn<void, [string]>(() => {
  return;
});

describe('onSuccess', () => {
  describe('called from Result', () => {
    it('is called on a success Result.', () => {
      const result = success('ay').onSuccess(successCb);

      expect(result.isSuccess()).toBe(true);
      expect(result.get()).toBe('ay');
      expect(successCb).toHaveBeenCalledWith('ay');
    });

    it('is NOT called on a failure Result.', () => {
      const err = new Error('nay');

      const result = failure<string, Error>(err).onSuccess(successCb);

      expect(result.isFailure()).toBe(true);
      expect(result.get()).toBe(err);
      expect(successCb).not.toHaveBeenCalled();
    });
  });

  describe('called from ResultPromise', () => {
    it('is called on a success Result.', async () => {
      const result = await success('ay').toResultPromise().onSuccess(successCb);

      expect(result.isSuccess()).toBe(true);
      expect(result.get()).toBe('ay');
      expect(successCb).toHaveBeenCalledWith('ay');
    });

    it('is NOT called on a failure Result.', async () => {
      const err = new Error('nay');

      const result = await failure<string, Error>(err)
        .toResultPromise()
        .onSuccess(successCb);

      expect(result.isFailure()).toBe(true);
      expect(result.get()).toBe(err);
      expect(successCb).not.toHaveBeenCalled();
    });
  });
});
