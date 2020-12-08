import { success, failure } from '..';

describe('getOrUndefined', () => {
  describe('called from Result', () => {
    it('returns the encapsulated value when invoked on success Result.', () => {
      const result = success('ay');

      expect(result.isSuccess()).toBe(true);
      expect(result.getOrUndefined()).toBe('ay');
    });

    it('returns undefined when invoked on failure Result.', () => {
      const result = failure(new Error('nay'));

      expect(result.isFailure()).toBe(true);
      expect(result.getOrUndefined()).toBeUndefined();
    });
  });

  describe('called from ResultPromise', () => {
    it('returns the encapsulated value when invoked on success Result.', async () => {
      const result = success('ay').toResultPromise();

      expect(result.getOrUndefined()).resolves.toBe('ay');
    });

    it('returns undefined when invoked on failure Result.', async () => {
      const result = failure(new Error('nay')).toResultPromise();

      expect(result.getOrUndefined()).resolves.toBeUndefined();
    });
  });
});
