import { success, failure } from '..';

beforeEach(() => {
  jest.clearAllMocks();
});

const f = jest.fn<string, [string]>((s: string) => `f(${s})`);

describe('mapSuccessAsync', () => {
  describe('called from Result', () => {
    it('maps a success with mapFn returing a Promise with a value.', async () => {
      const result = await success('ay').mapSuccessAsync((s) =>
        Promise.resolve(s).then(f),
      );

      expect(result.isSuccess()).toBe(true);
      expect(result.get()).toBe('f(ay)');
    });

    it('maps a failure bypassing mapFn.', async () => {
      const error = new Error('nay');

      const result = await failure<string, Error>(error).mapSuccessAsync((s) =>
        Promise.resolve(s).then(f),
      );

      expect(result.isFailure()).toBe(true);
      expect(result.get()).toBe(error);
      expect(f).not.toHaveBeenCalled();
    });
  });

  describe('called from ResultPromise', () => {
    it('maps a success with mapFn returing a Promise with a value.', async () => {
      const result = await success('ay')
        .toResultPromise()
        .mapSuccessAsync((s) => Promise.resolve(s).then(f));

      expect(result.isSuccess()).toBe(true);
      expect(result.get()).toBe('f(ay)');
    });

    it('maps a failure bypassing mapFn.', async () => {
      const error = new Error('nay');

      const result = await failure<string, Error>(error)
        .toResultPromise()
        .mapSuccessAsync((s) => Promise.resolve(s).then(f));

      expect(result.isFailure()).toBe(true);
      expect(result.get()).toBe(error);
      expect(f).not.toHaveBeenCalled();
    });
  });
});
