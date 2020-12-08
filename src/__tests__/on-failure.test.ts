import { success, failure } from '../..';

beforeEach(() => {
  jest.clearAllMocks();
});

const failureCb = jest.fn<void, [Error]>(() => {
  return;
});

describe('onFailure', () => {
  describe('called from Result', () => {
    it('is called on a failure Result.', () => {
      const err = new Error('nay');

      const result = failure(err).onFailure(failureCb);

      expect(result.isFailure()).toBe(true);
      expect((result.get() as Error).message).toBe('nay');
      expect(failureCb).toHaveBeenCalledWith(err);
    });

    it('is NOT called on a success Result.', () => {
      const result = success<string, Error>('ay').onFailure(failureCb);

      expect(result.isSuccess()).toBe(true);
      expect(result.get()).toBe('ay');
      expect(failureCb).not.toHaveBeenCalled();
    });
  });

  describe('called from ResultPromise', () => {
    it('is called on a failure Result.', async () => {
      const err = new Error('nay');

      const result = await failure(err).toResultPromise().onFailure(failureCb);

      expect(result.isFailure()).toBe(true);
      expect((result.get() as Error).message).toBe('nay');
      expect(failureCb).toHaveBeenCalledWith(err);
    });

    it('is NOT called on a success Result.', async () => {
      const result = await success<string, Error>('ay')
        .toResultPromise()
        .onFailure(failureCb);

      expect(result.isSuccess()).toBe(true);
      expect(result.get()).toBe('ay');
      expect(failureCb).not.toHaveBeenCalled();
    });
  });
});
