import { success, failure } from '../..';

beforeEach(() => {
  jest.clearAllMocks();
});

const f = jest.fn<string, [string]>((s: string) => `f(${s})`);
const g = jest.fn<string, [string]>((s: string) => `g(${s})`);

class CatchableError extends Error {}

describe('mapSuccessCatching', () => {
  describe('called from Result', () => {
    it('returns mapped value of success result catching error.', () => {
      const result = success('ay')
        .mapSuccessCatching(f)
        .mapSuccessCatching<string>((s) => {
          throw new CatchableError(g(s));
        });

      expect(result.isFailure()).toBe(true);
      expect((result.get() as Error).message).toBe('g(f(ay))');
    });

    it('returns mapped value of success result.', () => {
      const result = success('ay').mapSuccessCatching(f).mapSuccessCatching(g);

      expect(result.isSuccess()).toBe(true);
      expect(result.get()).toBe('g(f(ay))');
    });

    it('forwards a failure result.', () => {
      const error = new Error('nay');

      const result = failure<string, Error>(error)
        .mapSuccessCatching(f)
        .mapSuccessCatching(g);

      expect(result.isFailure()).toBe(true);
      expect(result.get()).toBe(error);

      expect(f).not.toHaveBeenCalled();
      expect(g).not.toHaveBeenCalled();
    });
  });

  describe('called from ResultPromise', () => {
    it('returns mapped value of success result catching error.', async () => {
      const result = await success('ay')
        .toResultPromise()
        .mapSuccessCatching(f)
        .mapSuccessCatching<string>((s) => {
          throw new CatchableError(g(s));
        });

      expect(result.isFailure()).toBe(true);
      expect((result.get() as Error).message).toBe('g(f(ay))');
    });

    it('returns mapped value of success result.', async () => {
      const result = await success('ay')
        .toResultPromise()
        .mapSuccessCatching(f)
        .mapSuccessCatching(g);

      expect(result.isSuccess()).toBe(true);
      expect(result.get()).toBe('g(f(ay))');
    });

    it('forwards a failure result.', async () => {
      const error = new Error('nay');

      const result = await failure<string, Error>(error)
        .toResultPromise()
        .mapSuccessCatching(f)
        .mapSuccessCatching(g);

      expect(result.isFailure()).toBe(true);
      expect(result.get()).toBe(error);
      expect(f).not.toHaveBeenCalled();
      expect(g).not.toHaveBeenCalled();
    });
  });
});
