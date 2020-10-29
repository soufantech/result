/* eslint-disable @typescript-eslint/no-unused-vars */
import { runCatching } from './result-utils';

export type Result<S, F> = SuccessResult<S, F> | FailureResult<S, F>;

export function isResult(value: unknown): value is Result<unknown, unknown> {
  return value instanceof SuccessResult || value instanceof FailureResult;
}

export class SuccessResult<S, F> {
  private value: S;

  constructor(success: S) {
    this.value = success;
  }

  isSuccess(): this is SuccessResult<S, F> {
    return true;
  }

  isFailure(): this is FailureResult<S, F> {
    return false;
  }

  mapSuccess<S2>(f: (s: S) => S2): Result<S2, F> {
    return new SuccessResult<S2, F>(f(this.value));
  }

  flatMapSuccess<S2>(f: (s: S) => Result<S2, F>): Result<S2, F> {
    return f(this.value);
  }

  flatMapFailure<F2>(_f: (s: F) => Result<S, F2>): Result<S, F2> {
    return (this as unknown) as Result<S, F2>;
  }

  mapFailure<F2>(_f: (s: F) => F2): Result<S, F2> {
    return (this as unknown) as Result<S, F2>;
  }

  fold<R>(onSuccess: (s: S) => R, _onFailure: (f: F) => R): R {
    return onSuccess(this.value);
  }

  recover(_transform: (f: F) => S): Result<S, F> {
    return this;
  }

  recoverCatching(_transform: (f: F) => S): Result<S, Error> {
    return (this as unknown) as Result<S, Error>;
  }

  onSuccess(f: (s: S) => void): Result<S, F> {
    f(this.value);

    return this;
  }

  onFailure(_f: (failure: F) => void): Result<S, F> {
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

  getOrElse<S2>(_onFailure: (f: F) => S2): S2 | S {
    return this.value;
  }

  getOrThrow(_transform?: (e: F) => Error): S {
    return this.value;
  }
}

export class FailureResult<S, F> {
  private value: F;

  constructor(failure: F) {
    this.value = failure;
  }

  isSuccess(): this is SuccessResult<S, F> {
    return false;
  }

  isFailure(): this is FailureResult<S, F> {
    return true;
  }

  mapSuccess<S2>(_f: (s: S) => S2): Result<S2, F> {
    return (this as unknown) as Result<S2, F>;
  }

  flatMapSuccess<S2>(_f: (s: S) => Result<S2, F>): Result<S2, F> {
    return (this as unknown) as Result<S2, F>;
  }

  flatMapFailure<F2>(f: (s: F) => Result<S, F2>): Result<S, F2> {
    return f(this.value);
  }

  mapFailure<F2>(f: (s: F) => F2): Result<S, F2> {
    return new FailureResult(f(this.value));
  }

  fold<R>(_onSuccess: (s: S) => R, onFailure: (f: F) => R): R {
    return onFailure(this.value);
  }

  recover(transform: (f: F) => S): Result<S, F> {
    return new SuccessResult(transform(this.value));
  }

  recoverCatching(transform: (f: F) => S): Result<S, Error> {
    return runCatching<S>(() => {
      return transform(this.value);
    });
  }

  onSuccess(_f: (s: S) => void): Result<S, F> {
    return this;
  }

  onFailure(f: (failure: F) => void): Result<S, F> {
    f(this.value);

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

  getOrElse<S2>(onFailure: (f: F) => S2): S2 | S {
    return onFailure(this.value);
  }

  getOrThrow(transform?: (e: F) => Error): S {
    throw transform ? transform(this.value) : this.value;
  }
}
