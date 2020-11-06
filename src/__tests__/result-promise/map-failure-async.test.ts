import { success, failure } from '../..';

beforeEach(() => {
  jest.clearAllMocks();
});

const x = jest.fn<string, [Error]>((e: Error) => `f(${e.message})`);

test('mapFailureAsync maps a failure with mapFn returing a Promise with a value.', async () => {
  const error = new Error('nay');

  const result = await failure<string, Error>(error)
    .toResultPromise()
    .mapFailureAsync((s) => Promise.resolve(s).then(x));

  expect(result.isFailure()).toBe(true);
  expect(result.get()).toBe('f(nay)');
});

test('mapFailureAsync maps a success bypassing mapFn.', async () => {
  const result = await success<string, Error>('ay')
    .toResultPromise()
    .mapFailureAsync((e) => Promise.resolve(e).then(x));

  expect(result.isSuccess()).toBe(true);
  expect(result.get()).toBe('ay');
  expect(x).not.toHaveBeenCalled();
});
