import { success, failure } from '../..';

beforeEach(() => {
  jest.clearAllMocks();
});

class RecoveringError extends Error {}

const recoverer = jest.fn<string, [Error]>((err) => {
  return `recovered(${err.message})`;
});

const throwingRecoverer = jest.fn<string, [Error]>((err) => {
  throw new RecoveringError(err.message);
});

describe('recoverCatching', () => {
  describe('called from Result', () => {
    it('has no effect on a success Result.', () => {
      const result = success<string, Error>('ay').recoverCatching(recoverer);

      expect(result.isSuccess()).toBe(true);
      expect(result.getOrThrow()).toBe('ay');
      expect(recoverer).not.toHaveBeenCalled();
    });

    it('returns the value returned from the transform function in a new Result when invoked on failure Result.', () => {
      const err = new Error('nay');

      const result = failure<string, Error>(err).recoverCatching(recoverer);

      expect(result.isSuccess()).toBe(true);
      expect(result.getOrThrow()).toBe('recovered(nay)');
      expect(recoverer).toHaveBeenCalledWith(err);
    });

    it('returns a failure Result with the Error instance thrown by the transform function invoked on failure Result.', () => {
      const err = new Error('nay');

      const result = failure<string, Error>(err).recoverCatching(
        throwingRecoverer,
      );

      expect(result.isFailure()).toBe(true);
      expect(() => {
        result.getOrThrow();
      }).toThrowError(RecoveringError);
      expect(throwingRecoverer).toHaveBeenCalledWith(err);
    });
  });

  describe('called from ResultPromise', () => {
    it('has no effect on a success Result.', async () => {
      const result = await success<string, Error>('ay')
        .toResultPromise()
        .recoverCatching(recoverer);

      expect(result.isSuccess()).toBe(true);
      expect(result.getOrThrow()).toBe('ay');
      expect(recoverer).not.toHaveBeenCalled();
    });

    it('returns the value returned from the transform function in a new Result when invoked on failure Result.', async () => {
      const err = new Error('nay');

      const result = await failure<string, Error>(err)
        .toResultPromise()
        .recoverCatching(recoverer);

      expect(result.isSuccess()).toBe(true);
      expect(result.getOrThrow()).toBe('recovered(nay)');
      expect(recoverer).toHaveBeenCalledWith(err);
    });

    it('returns a failure Result with the Error instance thrown by the transform function invoked on failure Result.', async () => {
      const err = new Error('nay');

      const result = await failure<string, Error>(err)
        .toResultPromise()
        .recoverCatching(throwingRecoverer);

      expect(result.isFailure()).toBe(true);
      expect(() => {
        result.getOrThrow();
      }).toThrowError(RecoveringError);
      expect(throwingRecoverer).toHaveBeenCalledWith(err);
    });
  });
});
