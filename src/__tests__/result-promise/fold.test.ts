import { success, failure } from '../..';

const onFailure = (err: Error) => `onFailure(${err.message})`;
const onSuccess = (s: string) => `onSuccess(${s})`;

test('fold returns the value returned from the onSuccess function on success Result.', async () => {
  const foldedStr = success<string, Error>('ay')
    .toResultPromise()
    .fold<string>(onSuccess, onFailure);

  expect(foldedStr).resolves.toBe('onSuccess(ay)');
});

test('fold returns the value returned from the onFailure function on failure Result.', async () => {
  const err = new Error('nay');

  const foldedStr = failure<string, Error>(err)
    .toResultPromise()
    .fold<string>(onSuccess, onFailure);

  expect(foldedStr).resolves.toBe('onFailure(nay)');
});
