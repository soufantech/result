import { success, failure } from '..';

beforeEach(() => {
  jest.clearAllMocks();
});

const f = jest.fn<string, [string]>((s: string) => `f(${s})`);
const g = jest.fn<string, [string]>((s: string) => `g(${s})`);

type Container<T> = { value: T };

function containerize<T>(value: T): Container<T> {
  return { value };
}

describe('flatMapSuccessCatching', () => {
  describe('called from Result', () => {
    it('returns the Result instance returned by the mapping function.', () => {
      const result = success(771)
        .flatMapSuccessCatching((n) => success(f(String(n))))
        .flatMapSuccessCatching((s) => success(containerize(g(s))));

      expect(result.isSuccess()).toBe(true);
      expect(result.get()).toStrictEqual({ value: 'g(f(771))' });
    });

    it('returns the Result instance returned by the mapping function catching.', () => {
      const result = success(771)
        .flatMapSuccessCatching((n) => success(f(String(n))))
        .flatMapSuccessCatching((s) => {
          throw new Error(g(s));
        });

      expect(result.isFailure()).toBe(true);
      expect((result.get() as Error).message).toBe('g(f(771))');
    });

    it('forwards a failure result.', () => {
      const result = success<number, Error>(771)
        .flatMapSuccessCatching((n) => success(f(String(n))))
        .flatMapSuccessCatching((s) => failure<string, Error>(new Error(s)))
        .flatMapSuccessCatching((s) => success(containerize(g(s))));

      expect(result.isFailure()).toBe(true);

      expect(result.get()).toBeInstanceOf(Error);
      expect((result.get() as Error).message).toBe('f(771)');

      expect(g).not.toHaveBeenCalled();
      expect(f).toHaveBeenCalledWith('771');
    });
  });

  describe('called from ResultPromise', () => {
    it('returns the Result instance returned by the mapping function.', async () => {
      const result = await success(771)
        .toResultPromise()
        .flatMapSuccessCatching((n) => success(f(String(n))))
        .flatMapSuccessCatching((s) => success(containerize(g(s))));

      expect(result.isSuccess()).toBe(true);
      expect(result.get()).toStrictEqual({ value: 'g(f(771))' });
    });

    it('returns the Result instance returned by the mapping function catching.', async () => {
      const result = await success(771)
        .toResultPromise()
        .flatMapSuccessCatching((n) => success(f(String(n))))
        .flatMapSuccessCatching((s) => {
          throw new Error(g(s));
        });

      expect(result.isFailure()).toBe(true);
      expect((result.get() as Error).message).toBe('g(f(771))');
    });

    it('forwards a failure result.', async () => {
      const result = await success<number, Error>(771)
        .toResultPromise()
        .flatMapSuccessCatching((n) => success(f(String(n))))
        .flatMapSuccessCatching((s) => failure<string, Error>(new Error(s)))
        .flatMapSuccessCatching((s) => success(containerize(g(s))));

      expect(result.isFailure()).toBe(true);
      expect(result.get()).toBeInstanceOf(Error);
      expect((result.get() as Error).message).toBe('f(771)');
      expect(g).not.toHaveBeenCalled();
      expect(f).toHaveBeenCalledWith('771');
    });
  });
});
