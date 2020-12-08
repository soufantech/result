import { success, failure } from '../..';

describe('isSuccess', () => {
  describe('called from Result', () => {
    it('returns true when invoked on success result.', () => {
      const result = success('ay');

      expect(result.isSuccess()).toBe(true);
    });

    it('returns false when invoked on failure result.', () => {
      const result = failure('nay');

      expect(result.isSuccess()).toBe(false);
    });
  });

  describe('called from ResultPromise', () => {
    it('returns true when invoked on success result.', async () => {
      const result = success('ay').toResultPromise();

      expect(result.isSuccess()).resolves.toBe(true);
    });

    it('returns false when invoked on failure result.', async () => {
      const result = failure('nay').toResultPromise();

      expect(result.isSuccess()).resolves.toBe(false);
    });
  });
});
