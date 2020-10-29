import { Result, SuccessResult, FailureResult } from './result';

export function success<S, F>(s: S): Result<F, S> {
  return new SuccessResult(s);
}

export function failure<S, F>(f: F): Result<F, S> {
  return new FailureResult(f);
}

/**
 * Converts the result of a promise into a result.
 * If the promise is rejected, the rejected value is a failure `Result`.
 * If the promise is resolved, the resolved value is a success `Result`.
 *
 * @example <caption>When the promise returns a value or throws:</caption>
 *
 * // Assuming `findUserById` returns a rejected promise if user is not found.
 * const result = await fromPromise(findUserById(5));
 *
 * const user = result.getOrFail();
 */
export function fromPromise<F, S>(s: Promise<S>): Promise<Result<F, S>> {
  return s.then((h) => success<S, F>(h)).catch((c) => failure<S, F>(c));
}

/**
 * Runs a synchronous function, converting its result or thrown exception
 * into a `Result`.
 *
 * @example <caption>When code throws an exception</caption>
 *
 * // Assuming user DOESN'T have the permissions to read the '/etc/passwd' file:
 *
 * const readingResult = runCatching(() => {
 *   return fs.readFileSync('/etc/passwd');
 * });
 *
 * readingResult.isFailure(); // true
 *
 * const fileContent = readingResult.getOrFail(); // throws Error: EACCESS
 *
 * @example <caption>When code throws an exception</caption>
 *
 * // Assuming user DOES have the permissions to read the '/etc/passwd' file:
 *
 * const readingResult = runCatching(() => {
 *   return fs.readFileSync('/etc/passwd');
 * });
 *
 * readingResult.isSuccess(); // true
 *
 * const fileContent = readingResult.getOrFail(); // returns file content
 *
 * @example <caption>Using just for the collateral effect</caption>
 *
 * const result = runCatching(() => {
 *   jwt.verify(token, 'wrong-secret'); // returning nothing here.
 * });
 *
 * result.isSuccess() // false
 */
export function runCatching<S>(run: () => S): Result<Error, S> {
  try {
    return success(run());
  } catch (err) {
    return failure(err);
  }
}

/**
 * The async version of `runCatching`.
 *
 * @see runCatching
 * @see fromPromise
 * @example
 *
 * // Assuming `makeRemoteRequest` returns a rejected promise:
 *
 * const responseResult = await runCatchingAsync(() => {
 *   return makeRemoteRequest(); // returns a `Promise`
 * });
 *
 * responseResult.isFailure(); // true
 *
 * const httpResponse = responseResult.getOrFail(); // throws an error because promise was rejected.
 *
 */
export function runCatchingAsync<S>(
  run: () => Promise<S>,
): Promise<Result<Error, S>> {
  return fromPromise(run());
}
