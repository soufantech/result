import { success, failure } from '..';

beforeEach(() => {
  jest.clearAllMocks();
});

const onFailure = jest.fn<string, [Error]>(
  (err: Error) => `onFailure(${err.message})`,
);
const onSuccess = jest.fn<string, [string]>((s: string) => `onSuccess(${s})`);

describe('fold', () => {
  describe('called from Result', () => {
    it('returns the value returned from the onSuccess function on success Result.', () => {
      const foldedStr = success<string, Error>('ay').fold<string>(
        onSuccess,
        onFailure,
      );

      expect(foldedStr).toBe('onSuccess(ay)');

      expect(onSuccess).toHaveBeenCalledWith('ay');
      expect(onFailure).not.toHaveBeenCalled();
    });

    it('returns the value returned from the onFailure function on failure Result.', () => {
      const err = new Error('nay');

      const foldedStr = failure<string, Error>(err).fold<string>(
        onSuccess,
        onFailure,
      );

      expect(foldedStr).toBe('onFailure(nay)');

      expect(onFailure).toHaveBeenCalledWith(err);
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  describe('called from ResultPromise', () => {
    it('returns the value returned from the onSuccess function on success Result.', async () => {
      const foldedStr = success<string, Error>('ay')
        .toResultPromise()
        .fold<string>(onSuccess, onFailure);

      expect(foldedStr).resolves.toBe('onSuccess(ay)');
    });

    it('returns the value returned from the onFailure function on failure Result.', async () => {
      const err = new Error('nay');

      const foldedStr = failure<string, Error>(err)
        .toResultPromise()
        .fold<string>(onSuccess, onFailure);

      expect(foldedStr).resolves.toBe('onFailure(nay)');
    });
  });
});
