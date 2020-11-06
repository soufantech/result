/* eslint-disable @typescript-eslint/no-unused-vars */
import { runCatching, fromPromise } from './result-utils';
import { ResultPromise } from './result-promise';

export type Result<S, F> = SuccessResult<S, F> | FailureResult<S, F>;

export class SuccessResult<S, F> {
  private value: S;

  private constructor(success: S) {
    this.value = success;
  }

  static create<S, F>(success: S): Result<S, F> {
    return new SuccessResult(success);
  }

  isSuccess(): this is SuccessResult<S, F> {
    return true;
  }

  isFailure(): this is FailureResult<S, F> {
    return false;
  }

  onSuccess(callbackFn: (s: S) => void): Result<S, F> {
    callbackFn(this.value);

    return this;
  }

  onFailure(_callbackFn: (f: F) => void): Result<S, F> {
    return this;
  }

  mapSuccess<S2>(mapFn: (s: S) => S2): Result<S2, F> {
    return new SuccessResult<S2, F>(mapFn(this.value));
  }

  mapFailure<F2>(_mapFn: (s: F) => F2): Result<S, F2> {
    return (this as unknown) as Result<S, F2>;
  }

  mapSuccessCatching<S2, E = Error>(mapFn: (s: S) => S2): Result<S2, F | E> {
    return runCatching<S2, E>(() => {
      return mapFn(this.value);
    });
  }

  mapFailureCatching<F2, E = Error>(_mapFn: (s: F) => F2): Result<S, F2 | E> {
    return (this as unknown) as Result<S, F2 | E>;
  }

  flatMapSuccess<S2>(mapFn: (s: S) => Result<S2, F>): Result<S2, F> {
    return mapFn(this.value);
  }

  flatMapFailure<F2>(_mapFn: (s: F) => Result<S, F2>): Result<S, F2> {
    return (this as unknown) as Result<S, F2>;
  }

  mapSuccessAsync<S2>(mapFn: (s: S) => PromiseLike<S2>): ResultPromise<S2, F> {
    return ResultPromise.success(mapFn(this.value));
  }

  mapFailureAsync<F2>(_mapFn: (f: F) => PromiseLike<F2>): ResultPromise<S, F2> {
    return new ResultPromise((this as unknown) as Result<S, F2>);
  }

  flatMapSuccessAsync<S2>(
    mapFn: (s: S) => ResultPromise<S2, F> | PromiseLike<Result<S2, F>>,
  ): ResultPromise<S2, F> {
    return new ResultPromise(mapFn(this.value));
  }

  flatMapFailureAsync<F2>(
    _mapFn: (f: F) => ResultPromise<S, F2> | PromiseLike<Result<S, F2>>,
  ): ResultPromise<S, F2> {
    return new ResultPromise((this as unknown) as Result<S, F2>);
  }

  mapSuccessAsyncCatching<S2, E = Error>(
    mapFn: (s: S) => PromiseLike<S2>,
  ): ResultPromise<S2, F | E> {
    return new ResultPromise<S2, E>(
      fromPromise<S2, E>(Promise.resolve(mapFn(this.value))),
    );
  }

  mapFailureAsyncCatching<F2, E = Error>(
    _mapFn: (f: F) => PromiseLike<F2>,
  ): ResultPromise<S, F2 | E> {
    return new ResultPromise<S, F2 | E>((this as unknown) as Result<S, F2>);
  }

  flatMapSuccessAsyncCatching<S2, E = Error>(
    mapFn: (s: S) => ResultPromise<S2, F> | PromiseLike<Result<S2, F>>,
  ): ResultPromise<S2, F | E> {
    return new ResultPromise(
      Promise.resolve(mapFn(this.value)).catch((e) =>
        FailureResult.create<S2, F | E>(e),
      ),
    );
  }

  flatMapFailureAsyncCatching<F2, E = Error>(
    _mapFn: (f: F) => ResultPromise<S, F2> | PromiseLike<Result<S, F2>>,
  ): ResultPromise<S, F2 | E> {
    return new ResultPromise<S, F2 | E>((this as unknown) as Result<S, F2>);
  }

  toResultPromise(): ResultPromise<S, F> {
    return new ResultPromise<S, F>(this);
  }

  recover(_recoverFn: (f: F) => S): Result<S, F> {
    return this;
  }

  recoverCatching(_recoverFn: (f: F) => S): Result<S, Error> {
    return (this as unknown) as Result<S, Error>;
  }

  fold<R>(foldSuccessFn: (s: S) => R, _foldFailureFn: (f: F) => R): R {
    return foldSuccessFn(this.value);
  }

  get(): S {
    return this.value;
  }

  getOrDefault<S2>(_defaultValue: S2): S | S2 {
    return this.value;
  }

  getOrNull(): S | null {
    return this.value;
  }

  getOrUndefined(): S | undefined {
    return this.value;
  }

  getOrElse<S2>(_elseFn: (f: F) => S2): S2 | S {
    return this.value;
  }

  getOrThrow(_transformFn?: (e: F) => Error): S {
    return this.value;
  }
}

export class FailureResult<S, F> {
  private value: F;

  private constructor(failure: F) {
    this.value = failure;
  }

  static create<S, F>(failure: F): Result<S, F> {
    return new FailureResult(failure);
  }

  isSuccess(): this is SuccessResult<S, F> {
    return false;
  }

  isFailure(): this is FailureResult<S, F> {
    return true;
  }

  onSuccess(_callbackFn: (s: S) => void): Result<S, F> {
    return this;
  }

  onFailure(callbackFn: (f: F) => void): Result<S, F> {
    callbackFn(this.value);

    return this;
  }

  mapSuccess<S2>(_mapFn: (s: S) => S2): Result<S2, F> {
    return (this as unknown) as Result<S2, F>;
  }

  mapFailure<F2>(mapFn: (s: F) => F2): Result<S, F2> {
    return new FailureResult<S, F2>(mapFn(this.value));
  }

  mapSuccessCatching<S2, E = Error>(_mapFn: (s: S) => S2): Result<S2, F | E> {
    return (this as unknown) as Result<S2, F | E>;
  }

  mapFailureCatching<F2, E = Error>(mapFn: (s: F) => F2): Result<S, F2 | E> {
    try {
      return failure<S, F2>(mapFn(this.value));
    } catch (err) {
      return failure<S, E>(err);
    }
  }

  flatMapSuccess<S2>(_mapFn: (s: S) => Result<S2, F>): Result<S2, F> {
    return (this as unknown) as Result<S2, F>;
  }

  flatMapFailure<F2>(mapFn: (s: F) => Result<S, F2>): Result<S, F2> {
    return mapFn(this.value);
  }

  mapSuccessAsync<S2>(_mapFn: (s: S) => PromiseLike<S2>): ResultPromise<S2, F> {
    return new ResultPromise<S2, F>((this as unknown) as Result<S2, F>);
  }

  mapFailureAsync<F2>(mapFn: (f: F) => PromiseLike<F2>): ResultPromise<S, F2> {
    return ResultPromise.failure(mapFn(this.value));
  }

  flatMapSuccessAsync<S2>(
    _mapFn: (s: S) => ResultPromise<S2, F> | PromiseLike<Result<S2, F>>,
  ): ResultPromise<S2, F> {
    return new ResultPromise((this as unknown) as Result<S2, F>);
  }

  flatMapFailureAsync<F2>(
    mapFn: (f: F) => ResultPromise<S, F2> | PromiseLike<Result<S, F2>>,
  ): ResultPromise<S, F2> {
    return new ResultPromise(mapFn(this.value));
  }

  mapSuccessAsyncCatching<S2, E = Error>(
    _mapFn: (s: S) => PromiseLike<S2>,
  ): ResultPromise<S2, F | E> {
    return new ResultPromise<S2, F | E>((this as unknown) as Result<S2, F>);
  }

  mapFailureAsyncCatching<F2, E = Error>(
    mapFn: (f: F) => PromiseLike<F2>,
  ): ResultPromise<S, F2 | E> {
    return ResultPromise.failure(
      Promise.resolve(mapFn(this.value)).catch((e) => e),
    );
  }

  flatMapSuccessAsyncCatching<S2, E = Error>(
    _mapFn: (s: S) => ResultPromise<S2, F> | PromiseLike<Result<S2, F>>,
  ): ResultPromise<S2, F | E> {
    return new ResultPromise<S2, F | E>((this as unknown) as Result<S2, F>);
  }

  flatMapFailureAsyncCatching<F2, E = Error>(
    mapFn: (f: F) => ResultPromise<S, F2> | PromiseLike<Result<S, F2>>,
  ): ResultPromise<S, F2 | E> {
    return new ResultPromise(
      Promise.resolve(mapFn(this.value)).catch(
        (e) => new FailureResult<S, F2 | E>(e),
      ),
    );
  }

  toResultPromise(): ResultPromise<S, F> {
    return new ResultPromise<S, F>(this);
  }

  recover(recoverFn: (f: F) => S): Result<S, F> {
    return SuccessResult.create<S, F>(recoverFn(this.value));
  }

  recoverCatching(recoverFn: (f: F) => S): Result<S, Error> {
    return runCatching<S>(() => {
      return recoverFn(this.value);
    });
  }

  fold<R>(_foldSuccessFn: (s: S) => R, foldFailureFn: (f: F) => R): R {
    return foldFailureFn(this.value);
  }

  get(): F {
    return this.value;
  }

  getOrDefault<S2>(defaultValue: S2): S | S2 {
    return defaultValue;
  }

  getOrNull(): S | null {
    return null;
  }

  getOrUndefined(): S | undefined {
    return undefined;
  }

  getOrElse<S2>(elseFn: (f: F) => S2): S2 | S {
    return elseFn(this.value);
  }

  getOrThrow(transformFn?: (e: F) => Error): S {
    throw transformFn ? transformFn(this.value) : this.value;
  }
}

export const success = SuccessResult.create;
export const failure = FailureResult.create;
