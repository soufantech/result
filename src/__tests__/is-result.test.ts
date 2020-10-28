import { success, failure } from '..';
import { isResult } from '../result';

test('isResult returns true when passed a Result instance.', () => {
  const failureResult = failure('nay');
  const successResult = success('ay');

  expect(isResult(failureResult)).toBe(true);
  expect(isResult(successResult)).toBe(true);
});

test.each([
  new Error('nay'),
  null,
  true,
  undefined,
  '',
  [],
  false,
  true,
  { isFailure: true, isSuccess: false },
  { isFailure: false, isSuccess: true },
])('isResult returns false when passed a NON Result instance.', (value) => {
  expect(isResult(value)).toBe(false);
});
