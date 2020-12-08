import { success, failure } from '..';

beforeEach(() => {
  jest.clearAllMocks();
});

const recoverer = jest.fn<string, [Error]>((err) => {
  return `recovered(${err.message})`;
});

describe('recoverAsync', () => {
  describe('called from Result', () => {
    it('has no effect on a success Result.', async () => {
      const result = await success<string, Error>('ay').recoverAsync((f) =>
        Promise.resolve(f).then(recoverer),
      );

      expect(result.isSuccess()).toBe(true);
      expect(result.getOrThrow()).toBe('ay');
      expect(recoverer).not.toHaveBeenCalled();
    });

    it('returns the value returned from the transform function in a new Result when invoked on failure Result.', async () => {
      const err = new Error('nay');

      const result = await failure<string, Error>(err).recoverAsync((f) =>
        Promise.resolve(f).then(recoverer),
      );

      expect(result.isSuccess()).toBe(true);
      expect(result.getOrThrow()).toBe('recovered(nay)');
      expect(recoverer).toHaveBeenCalledWith(err);
    });
  });

  describe('called from ResultPromise', () => {
    it('has no effect on a success Result.', async () => {
      const result = await success<string, Error>('ay')
        .toResultPromise()
        .recoverAsync((f) => Promise.resolve(f).then(recoverer));

      expect(result.isSuccess()).toBe(true);
      expect(result.getOrThrow()).toBe('ay');
      expect(recoverer).not.toHaveBeenCalled();
    });

    it('returns the value returned from the transform function in a new Result when invoked on failure Result.', async () => {
      const err = new Error('nay');

      const result = await failure<string, Error>(err)
        .toResultPromise()
        .recoverAsync((f) => Promise.resolve(f).then(recoverer));

      expect(result.isSuccess()).toBe(true);
      expect(result.getOrThrow()).toBe('recovered(nay)');
      expect(recoverer).toHaveBeenCalledWith(err);
    });
  });
});
