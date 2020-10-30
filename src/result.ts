/* eslint-disable @typescript-eslint/no-unused-vars */
import { runCatching } from './result-utils';

export type Result<S, F> = SuccessResult<S, F> | FailureResult<S, F>;

/**
 * @private
 */
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

  mapSuccess<S2>(mapFn: (s: S) => S2): Result<S2, F> {
    return new SuccessResult<S2, F>(mapFn(this.value));
  }

  flatMapSuccess<S2>(mapFn: (s: S) => Result<S2, F>): Result<S2, F> {
    return mapFn(this.value);
  }

  flatMapFailure<F2>(_mapFn: (s: F) => Result<S, F2>): Result<S, F2> {
    return (this as unknown) as Result<S, F2>;
  }

  mapFailure<F2>(_mapFn: (s: F) => F2): Result<S, F2> {
    return (this as unknown) as Result<S, F2>;
  }

  fold<R>(foldSuccessFn: (s: S) => R, _foldFailureFn: (f: F) => R): R {
    return foldSuccessFn(this.value);
  }

  recover(_recoverFn: (f: F) => S): Result<S, F> {
    return this;
  }

  recoverCatching(_recoverFn: (f: F) => S): Result<S, Error> {
    return (this as unknown) as Result<S, Error>;
  }

  onSuccess(callbackFn: (s: S) => void): Result<S, F> {
    callbackFn(this.value);

    return this;
  }

  onFailure(_callbackFn: (f: F) => void): Result<S, F> {
    return this;
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

  mapSuccess<S2>(_mapFn: (s: S) => S2): Result<S2, F> {
    return (this as unknown) as Result<S2, F>;
  }

  flatMapSuccess<S2>(_mapFn: (s: S) => Result<S2, F>): Result<S2, F> {
    return (this as unknown) as Result<S2, F>;
  }

  flatMapFailure<F2>(mapFn: (s: F) => Result<S, F2>): Result<S, F2> {
    return mapFn(this.value);
  }

  mapFailure<F2>(mapFn: (s: F) => F2): Result<S, F2> {
    return new FailureResult(mapFn(this.value));
  }

  fold<R>(_foldSuccessFn: (s: S) => R, foldFailureFn: (f: F) => R): R {
    return foldFailureFn(this.value);
  }

  recover(recoverFn: (f: F) => S): Result<S, F> {
    return SuccessResult.create(recoverFn(this.value));
  }

  recoverCatching(recoverFn: (f: F) => S): Result<S, Error> {
    return runCatching<S>(() => {
      return recoverFn(this.value);
    });
  }

  onSuccess(_callbackFn: (s: S) => void): Result<S, F> {
    return this;
  }

  onFailure(callbackFn: (f: F) => void): Result<S, F> {
    callbackFn(this.value);

    return this;
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
