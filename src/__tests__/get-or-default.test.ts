import { success, failure } from '../..';

describe('getOrDefault', () => {
  describe('called from Result', () => {
    it('returns the encapsulated value when invoked on success Result.', () => {
      const result = success('ay');

      expect(result.isSuccess()).toBe(true);
      expect(result.getOrDefault('ray')).toBe('ay');
    });

    it('returns the default value when invoked on failure Result.', () => {
      const result = failure(new Error('nay'));

      expect(result.isFailure()).toBe(true);
      expect(result.getOrDefault('ray')).toBe('ray');
    });
  });

  describe('called from ResultPromise', () => {
    it('returns the encapsulated value when invoked on success Result.', async () => {
      const result = success('ay').toResultPromise();

      expect(result.getOrDefault('ray')).resolves.toBe('ay');
    });

    it('returns the default value when invoked on failure Result.', async () => {
      const result = failure(new Error('nay')).toResultPromise();

      expect(result.getOrDefault('ray')).resolves.toBe('ray');
    });
  });
});
