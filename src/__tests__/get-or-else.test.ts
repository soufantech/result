import { success, failure } from '..';

beforeEach(() => {
  jest.clearAllMocks();
});

const getErrorMessage = jest.fn<string, [Error]>((err) => {
  return err.message;
});

describe('getOrElse', () => {
  describe('called from Result', () => {
    it('returns the encapsulated value when invoked on success Result.', () => {
      const result = success<string, Error>('ay');

      expect(result.isSuccess()).toBe(true);
      expect(result.getOrElse(getErrorMessage)).toBe('ay');
      expect(getErrorMessage).not.toHaveBeenCalled();
    });

    it('returns the value returned from the transform function when invoked on failure Result.', () => {
      const err = new Error('nay');

      const result = failure<string, Error>(err);

      expect(result.isFailure()).toBe(true);
      expect(result.getOrElse(getErrorMessage)).toBe('nay');
      expect(getErrorMessage).toHaveBeenCalledWith(err);
    });
  });

  describe('called from ResultPromise', () => {
    it('returns the encapsulated value when invoked on success Result.', async () => {
      const result = success<string, Error>('ay').toResultPromise();

      expect(result.getOrElse(getErrorMessage)).resolves.toBe('ay');
    });

    it('returns the value returned from the transform function when invoked on failure Result.', async () => {
      const err = new Error('nay');

      const result = failure<string, Error>(err).toResultPromise();

      expect(result.getOrElse(getErrorMessage)).resolves.toBe('nay');
    });
  });
});
