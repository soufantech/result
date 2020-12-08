import { success, failure } from '..';

beforeEach(() => {
  jest.clearAllMocks();
});

const f = jest.fn<string, [string]>((s: string) => `f(${s})`);
const g = jest.fn<string, [string]>((s: string) => `g(${s})`);

class RejectedError extends Error {}

describe('flatMapSuccessAsyncCatching', () => {
  describe('called from Result', () => {
    it('maps a success with mapFn returning a Promise with a Result.', async () => {
      const result = await success('ay').flatMapSuccessAsyncCatching((s) =>
        Promise.resolve(success(f(s))),
      );

      expect(result.isSuccess()).toBe(true);
      expect(result.get()).toBe('f(ay)');
    });

    it('maps a success handling the rejected Promise from mapFn.', async () => {
      const result = await success('ay').flatMapSuccessAsyncCatching((s) =>
        Promise.reject(new RejectedError(f(s))),
      );

      expect(result.isFailure()).toBe(true);
      expect(result.get()).toBeInstanceOf(RejectedError);
      expect((result.get() as Error).message).toBe('f(ay)');
    });

    it('maps a success with mapFn returning a PromiseResult.', async () => {
      const result = await success('ay').flatMapSuccessAsyncCatching((s) =>
        success(f(s)).flatMapSuccessAsync((s2) =>
          Promise.resolve(success(g(s2))),
        ),
      );

      expect(result.isSuccess()).toBe(true);
      expect(result.get()).toBe('g(f(ay))');
    });

    it('maps a failure bypassing mapFn.', async () => {
      const error = new Error('nay');

      const result = await failure<string, Error>(
        error,
      ).flatMapSuccessAsyncCatching((s) => Promise.resolve(success(f(s))));

      expect(result.isFailure()).toBe(true);
      expect(result.get()).toBeInstanceOf(Error);
      expect((result.get() as Error).message).toBe('nay');
      expect(f).not.toHaveBeenCalled();
    });
  });

  describe('called from ResultPromise', () => {
    it('maps a success with mapFn returning a Promise with a Result.', async () => {
      const result = await success('ay')
        .toResultPromise()
        .flatMapSuccessAsyncCatching((s) => Promise.resolve(success(f(s))));

      expect(result.isSuccess()).toBe(true);
      expect(result.get()).toBe('f(ay)');
    });

    it('maps a success handling the rejected Promise from mapFn.', async () => {
      const result = await success('ay')
        .toResultPromise()
        .flatMapSuccessAsyncCatching((s) =>
          Promise.reject(new RejectedError(f(s))),
        );

      expect(result.isFailure()).toBe(true);
      expect(result.get()).toBeInstanceOf(RejectedError);
      expect((result.get() as Error).message).toBe('f(ay)');
    });

    it('maps a success with mapFn returning a PromiseResult.', async () => {
      const result = await success('ay')
        .toResultPromise()
        .flatMapSuccessAsyncCatching((s) =>
          success(f(s)).flatMapSuccessAsync((s2) =>
            Promise.resolve(success(g(s2))),
          ),
        );

      expect(result.isSuccess()).toBe(true);
      expect(result.get()).toBe('g(f(ay))');
    });

    it('maps a failure bypassing mapFn.', async () => {
      const error = new Error('nay');

      const result = await failure<string, Error>(error)
        .toResultPromise()
        .flatMapSuccessAsyncCatching((s) => Promise.resolve(success(f(s))));

      expect(result.isFailure()).toBe(true);
      expect(result.get()).toBeInstanceOf(Error);
      expect((result.get() as Error).message).toBe('nay');
      expect(f).not.toHaveBeenCalled();
    });
  });
});
