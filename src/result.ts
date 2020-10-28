/* eslint-disable @typescript-eslint/no-unused-vars */
import { runCatching } from './result-utils';

export type Result<TFailure, TSuccess> =
  | SuccessResult<TFailure, TSuccess>
  | FailureResult<TFailure, TSuccess>;

export function isResult(value: unknown): value is Result<unknown, unknown> {
  return value instanceof SuccessResult || value instanceof FailureResult;
}

export class SuccessResult<TFailure, TSuccess> {
  private value: TSuccess;

  constructor(success: TSuccess) {
    this.value = success;
  }

  isSuccess(): this is SuccessResult<TFailure, TSuccess> {
    return true;
  }

  isFailure(): this is FailureResult<TFailure, TSuccess> {
    return false;
  }

  mapSuccess<S>(f: (s: TSuccess) => S): Result<TFailure, S> {
    return new SuccessResult<TFailure, S>(f(this.value));
  }

  flatMapSuccess<S>(
    f: (s: TSuccess) => Result<TFailure, S>,
  ): Result<TFailure, S> {
    return f(this.value);
  }

  flatMapFailure<F>(
    _f: (s: TFailure) => Result<F, TSuccess>,
  ): Result<F, TSuccess> {
    return (this as unknown) as Result<F, TSuccess>;
  }

  mapFailure<F>(_f: (s: TFailure) => F): Result<F, TSuccess> {
    return (this as unknown) as Result<F, TSuccess>;
  }

  fold<R>(onSuccess: (s: TSuccess) => R, _onFailure: (f: TFailure) => R): R {
    return onSuccess(this.value);
  }

  recover(_transform: (f: TFailure) => TSuccess): Result<TFailure, TSuccess> {
    return this;
  }

  recoverCatching(
    _transform: (f: TFailure) => TSuccess,
  ): Result<Error, TSuccess> {
    return (this as unknown) as Result<Error, TSuccess>;
  }

  onSuccess(f: (s: TSuccess) => void): Result<TFailure, TSuccess> {
    f(this.value);

    return this;
  }

  onFailure(_f: (failure: TFailure) => void): Result<TFailure, TSuccess> {
    return this;
  }

  get(): TSuccess {
    return this.value;
  }

  getOrDefault<S>(_defaultValue: S): TSuccess | S {
    return this.value;
  }

  getOrNull(): TSuccess | null {
    return this.value;
  }

  getOrUndefined(): TSuccess | undefined {
    return this.value;
  }

  getOrElse<S>(_onFailure: (f: TFailure) => S): S | TSuccess {
    return this.value;
  }

  getOrThrow(_transform?: (e: TFailure) => Error): TSuccess {
    return this.value;
  }
}

export class FailureResult<TFailure, TSuccess> {
  private value: TFailure;

  constructor(failure: TFailure) {
    this.value = failure;
  }

  isSuccess(): this is SuccessResult<TFailure, TSuccess> {
    return false;
  }

  isFailure(): this is FailureResult<TFailure, TSuccess> {
    return true;
  }

  mapSuccess<S>(_f: (s: TSuccess) => S): Result<TFailure, S> {
    return (this as unknown) as Result<TFailure, S>;
  }

  flatMapSuccess<S>(
    _f: (s: TSuccess) => Result<TFailure, S>,
  ): Result<TFailure, S> {
    return (this as unknown) as Result<TFailure, S>;
  }

  flatMapFailure<F>(
    f: (s: TFailure) => Result<F, TSuccess>,
  ): Result<F, TSuccess> {
    return f(this.value);
  }

  mapFailure<F>(f: (s: TFailure) => F): Result<F, TSuccess> {
    return new FailureResult(f(this.value));
  }

  fold<R>(_onSuccess: (s: TSuccess) => R, onFailure: (f: TFailure) => R): R {
    return onFailure(this.value);
  }

  recover(transform: (f: TFailure) => TSuccess): Result<TFailure, TSuccess> {
    return new SuccessResult(transform(this.value));
  }

  recoverCatching(
    transform: (f: TFailure) => TSuccess,
  ): Result<Error, TSuccess> {
    return runCatching<TSuccess>(() => {
      return transform(this.value);
    });
  }

  onSuccess(_f: (s: TSuccess) => void): Result<TFailure, TSuccess> {
    return this;
  }

  onFailure(f: (failure: TFailure) => void): Result<TFailure, TSuccess> {
    f(this.value);

    return this;
  }

  get(): TFailure {
    return this.value;
  }

  getOrDefault<S>(defaultValue: S): TSuccess | S {
    return defaultValue;
  }

  getOrNull(): TSuccess | null {
    return null;
  }

  getOrUndefined(): TSuccess | undefined {
    return undefined;
  }

  getOrElse<S>(onFailure: (f: TFailure) => S): S | TSuccess {
    return onFailure(this.value);
  }

  getOrThrow(transform?: (e: TFailure) => Error): TSuccess {
    throw transform ? transform(this.value) : this.value;
  }
}
