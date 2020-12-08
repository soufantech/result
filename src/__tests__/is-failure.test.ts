import { success, failure } from '../..';

describe('isFailure', () => {
  describe('called from Result', () => {
    it('returns true when invoked on failure result.', () => {
      const result = failure('nay');

      expect(result.isFailure()).toBe(true);
    });

    it('returns false when invoked on success result.', () => {
      const result = success('ay');

      expect(result.isFailure()).toBe(false);
    });
  });

  describe('called from ResultPromise', () => {
    it('returns true when invoked on failure result.', async () => {
      const result = failure('nay').toResultPromise();

      expect(result.isFailure()).resolves.toBe(true);
    });

    it('returns false when invoked on success result.', async () => {
      const result = success('ay').toResultPromise();

      expect(result.isFailure()).resolves.toBe(false);
    });
  });
});
