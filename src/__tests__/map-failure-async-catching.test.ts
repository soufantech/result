import { success, failure } from '..';

beforeEach(() => {
  jest.clearAllMocks();
});

const x = jest.fn<string, [Error]>((e: Error) => `f(${e.message})`);

class AError extends Error {}
class BError extends Error {}
class RejectedError extends Error {}

describe('mapFailureAsyncCatching', () => {
  describe('called from Result', () => {
    it('maps a failure with mapFn returing a Promise with a value.', async () => {
      const error = new Error('nay');

      const result = await failure<string, Error>(
        error,
      ).mapFailureAsyncCatching((s) => Promise.resolve(s).then(x));

      expect(result.isFailure()).toBe(true);
      expect(result.get()).toBe('f(nay)');
    });

    it('maps a failure handling the rejected Promise from mapFn.', async () => {
      const result = await failure<unknown, AError>(
        new AError('nay'),
      ).mapFailureAsyncCatching<BError>((e) =>
        Promise.reject(new RejectedError(x(e))),
      );

      expect(result.isFailure()).toBe(true);
      expect(result.get()).toBeInstanceOf(RejectedError);
      expect((result.get() as Error).message).toBe('f(nay)');
    });

    it('maps a success bypassing mapFn.', async () => {
      const result = await success<string, Error>(
        'ay',
      ).mapFailureAsyncCatching((e) => Promise.resolve(e).then(x));

      expect(result.isSuccess()).toBe(true);
      expect(result.get()).toBe('ay');
      expect(x).not.toHaveBeenCalled();
    });
  });

  describe('called from ResultPromise', () => {
    it('maps a failure with mapFn returing a Promise with a value.', async () => {
      const error = new Error('nay');

      const result = await failure<string, Error>(error)
        .toResultPromise()
        .mapFailureAsyncCatching((s) => Promise.resolve(s).then(x));

      expect(result.isFailure()).toBe(true);
      expect(result.get()).toBe('f(nay)');
    });

    it('maps a failure handling the rejected Promise from mapFn.', async () => {
      const result = await failure<unknown, AError>(new AError('nay'))
        .toResultPromise()
        .mapFailureAsyncCatching<BError>((e) =>
          Promise.reject(new RejectedError(x(e))),
        );

      expect(result.isFailure()).toBe(true);
      expect(result.get()).toBeInstanceOf(RejectedError);
      expect((result.get() as Error).message).toBe('f(nay)');
    });

    it('maps a success bypassing mapFn.', async () => {
      const result = await success<string, Error>('ay')
        .toResultPromise()
        .mapFailureAsyncCatching((e) => Promise.resolve(e).then(x));

      expect(result.isSuccess()).toBe(true);
      expect(result.get()).toBe('ay');
      expect(x).not.toHaveBeenCalled();
    });
  });
});
