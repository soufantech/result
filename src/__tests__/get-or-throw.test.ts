import { success, failure } from '..';

class SorryError extends Error {
  constructor(err: Error) {
    super(`Sorry, ${err.message}`);
  }
}

describe('getOrThrow', () => {
  describe('called from Result', () => {
    it('returns the encapsulated value when invoked on success Result.', () => {
      const result = success('ay');

      expect(result.isSuccess()).toBe(true);

      const value = result.getOrThrow();

      expect(value).toBe('ay');
    });

    it('returns the encapsulated value when invoked on success Result, ignoring transform function.', () => {
      const result = success<string, Error>('ay');

      expect(result.isSuccess()).toBe(true);

      const value = result.getOrThrow((err: Error) => new SorryError(err));

      expect(value).toBe('ay');
    });

    it('throws the tranformed encapsulated value when invoked on failure Result, if a transform function is provided.', () => {
      const result = failure(new Error('nay'));

      expect(result.isFailure()).toBe(true);
      expect(() => {
        result.getOrThrow((err: Error) => new SorryError(err));
      }).toThrowError(SorryError);
    });
  });

  describe('called from ResultPromise', () => {
    it('returns the encapsulated value when invoked on success Result.', () => {
      const result = success('ay');

      expect(result.isSuccess()).toBe(true);

      const value = result.getOrThrow();

      expect(value).toBe('ay');
    });

    it('returns the encapsulated value when invoked on success Result, ignoring transform function.', async () => {
      const result = success<string, Error>('ay').toResultPromise();

      const value = result.getOrThrow((err: Error) => new SorryError(err));

      expect(value).resolves.toBe('ay');
    });

    it('throws the tranformed encapsulated value when invoked on failure Result, if a transform function is provided.', async () => {
      const result = failure(new Error('nay')).toResultPromise();

      expect(
        result.getOrThrow((err: Error) => new SorryError(err)),
      ).rejects.toThrow(SorryError);
    });
  });
});
