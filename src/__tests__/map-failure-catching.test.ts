import { success, failure } from '..';

beforeEach(() => {
  jest.clearAllMocks();
});

class TopError extends Error {}
class TopTopError extends TopError {}

const f = jest.fn<string, [string]>((s: string) => `f(${s})`);
const g = jest.fn<string, [string]>((s: string) => `g(${s})`);

describe('mapFailureCatching', () => {
  describe('called from Result', () => {
    it('returns mapped value of failure result.', () => {
      const result = failure('nay')
        .mapFailureCatching((msg) => new Error(msg))
        .mapFailureCatching((e) => new TopError(f(e.message)))
        .mapFailureCatching((e) => new TopTopError(g(e.message)));

      const err = result.get() as Error;

      expect(result.isFailure()).toBe(true);
      expect(err.message).toBe('g(f(nay))');
      expect(err).toBeInstanceOf(TopTopError);
    });

    it('returns mapped value of failure result catching.', () => {
      const result = failure('nay')
        .mapFailureCatching((msg) => new Error(msg))
        .mapFailureCatching((e) => new TopError(f(e.message)))
        .mapFailureCatching((e) => {
          throw new TopTopError(g(e.message));
        });
      const err = result.get() as Error;

      expect(result.isFailure()).toBe(true);
      expect(err.message).toBe('g(f(nay))');
      expect(err).toBeInstanceOf(TopTopError);
    });

    it('forwards a success result.', () => {
      const result = success<string, string>('ay')
        .mapFailureCatching((msg) => new Error(msg))
        .mapFailureCatching((e) => new TopError(f(e.message)))
        .mapFailureCatching((e) => new TopTopError(g(e.message)));

      expect(result.isSuccess()).toBe(true);
      expect(result.get()).toBe('ay');
      expect(f).not.toHaveBeenCalled();
      expect(g).not.toHaveBeenCalled();
    });
  });

  describe('called from ResultPromise', () => {
    it('returns mapped value of failure result.', async () => {
      const result = await failure('nay')
        .toResultPromise()
        .mapFailureCatching((msg) => new Error(msg))
        .mapFailureCatching((e) => new TopError(f(e.message)))
        .mapFailureCatching((e) => new TopTopError(g(e.message)));

      const err = result.get() as Error;

      expect(result.isFailure()).toBe(true);
      expect(err.message).toBe('g(f(nay))');
      expect(err).toBeInstanceOf(TopTopError);
    });

    it('returns mapped value of failure result catching.', async () => {
      const result = await failure('nay')
        .toResultPromise()
        .mapFailureCatching((msg) => new Error(msg))
        .mapFailureCatching((e) => new TopError(f(e.message)))
        .mapFailureCatching((e) => {
          throw new TopTopError(g(e.message));
        });

      const err = result.get() as Error;

      expect(result.isFailure()).toBe(true);
      expect(err.message).toBe('g(f(nay))');
      expect(err).toBeInstanceOf(TopTopError);
    });

    it('forwards a success result.', async () => {
      const result = await success<string, string>('ay')
        .toResultPromise()
        .mapFailureCatching((msg) => new Error(msg))
        .mapFailureCatching((e) => new TopError(f(e.message)))
        .mapFailureCatching((e) => new TopTopError(g(e.message)));

      const ok = result.get();

      expect(result.isSuccess()).toBe(true);
      expect(ok).toBe('ay');
      expect(f).not.toHaveBeenCalled();
      expect(g).not.toHaveBeenCalled();
    });
  });
});
