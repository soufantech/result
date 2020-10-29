/* eslint-disable @typescript-eslint/no-unused-vars */
import { runCatching } from './result-utils';

export type Result<F, S> = SuccessResult<F, S> | FailureResult<F, S>;

export function isResult(value: unknown): value is Result<unknown, unknown> {
  return value instanceof SuccessResult || value instanceof FailureResult;
}

export class SuccessResult<F, S> {
  private value: S;

  constructor(success: S) {
    this.value = success;
  }

  isSuccess(): this is SuccessResult<F, S> {
    return true;
  }

  isFailure(): this is FailureResult<F, S> {
    return false;
  }

  mapSuccess<S2>(f: (s: S) => S2): Result<F, S2> {
    return new SuccessResult<F, S2>(f(this.value));
  }

  flatMapSuccess<S2>(f: (s: S) => Result<F, S2>): Result<F, S2> {
    return f(this.value);
  }

  flatMapFailure<F2>(_f: (s: F) => Result<F2, S>): Result<F2, S> {
    return (this as unknown) as Result<F2, S>;
  }

  mapFailure<F2>(_f: (s: F) => F2): Result<F2, S> {
    return (this as unknown) as Result<F2, S>;
  }

  fold<R>(onSuccess: (s: S) => R, _onFailure: (f: F) => R): R {
    return onSuccess(this.value);
  }

  recover(_transform: (f: F) => S): Result<F, S> {
    return this;
  }

  recoverCatching(_transform: (f: F) => S): Result<Error, S> {
    return (this as unknown) as Result<Error, S>;
  }

  onSuccess(f: (s: S) => void): Result<F, S> {
    f(this.value);

    return this;
  }

  onFailure(_f: (failure: F) => void): Result<F, S> {
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

export class FailureResult<F, S> {
  private value: F;

  constructor(failure: F) {
    this.value = failure;
  }

  isSuccess(): this is SuccessResult<F, S> {
    return false;
  }

  isFailure(): this is FailureResult<F, S> {
    return true;
  }

  mapSuccess<S2>(_f: (s: S) => S2): Result<F, S2> {
    return (this as unknown) as Result<F, S2>;
  }

  flatMapSuccess<S2>(_f: (s: S) => Result<F, S2>): Result<F, S2> {
    return (this as unknown) as Result<F, S2>;
  }

  flatMapFailure<F2>(f: (s: F) => Result<F2, S>): Result<F2, S> {
    return f(this.value);
  }

  mapFailure<F2>(f: (s: F) => F2): Result<F2, S> {
    return new FailureResult(f(this.value));
  }

  fold<R>(_onSuccess: (s: S) => R, onFailure: (f: F) => R): R {
    return onFailure(this.value);
  }

  recover(transform: (f: F) => S): Result<F, S> {
    return new SuccessResult(transform(this.value));
  }

  recoverCatching(transform: (f: F) => S): Result<Error, S> {
    return runCatching<S>(() => {
      return transform(this.value);
    });
  }

  onSuccess(_f: (s: S) => void): Result<F, S> {
    return this;
  }

  onFailure(f: (failure: F) => void): Result<F, S> {
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
