import { Result, failure, success } from './result';

export class ResultPromise<S, F> implements PromiseLike<Result<S, F>> {
  private promise: Promise<Result<S, F>>;

  constructor(result: Result<S, F> | PromiseLike<Result<S, F>>) {
    this.promise = Promise.resolve(result);
  }

  static success<S, F>(promise: PromiseLike<S> | S): ResultPromise<S, F> {
    return new ResultPromise(Promise.resolve(promise).then((s) => success(s)));
  }

  static failure<S, F>(promise: PromiseLike<F> | F): ResultPromise<S, F> {
    return new ResultPromise(Promise.resolve(promise).then((f) => failure(f)));
  }

  then<T>(
    onfulfilled?:
      | ((result: Result<S, F>) => T | PromiseLike<T>)
      | null
      | undefined,
  ): PromiseLike<T> {
    return this.promise.then(onfulfilled);
  }

  isSuccess(): Promise<boolean> {
    return this.promise.then((r) => r.isSuccess());
  }

  isFailure(): Promise<boolean> {
    return this.promise.then((r) => r.isFailure());
  }

  mapSuccess<S2>(mapFn: (s: S) => S2): ResultPromise<S2, F> {
    return new ResultPromise(this.promise.then((r) => r.mapSuccess(mapFn)));
  }

  mapSuccessCatching<S2, E = Error>(
    mapFn: (s: S) => S2,
  ): ResultPromise<S2, F | E> {
    return new ResultPromise(
      this.promise.then((r) => r.mapSuccessCatching(mapFn)),
    );
  }

  mapFailureCatching<F2, E = Error>(
    mapFn: (s: F) => F2,
  ): ResultPromise<S, F2 | E> {
    return new ResultPromise(
      this.promise.then((r) => r.mapFailureCatching(mapFn)),
    );
  }

  mapSuccessAsync<S2>(mapFn: (s: S) => PromiseLike<S2>): ResultPromise<S2, F> {
    return new ResultPromise(
      this.promise.then((r) => r.mapSuccessAsync(mapFn)),
    );
  }

  mapFailureAsync<F2>(mapFn: (f: F) => PromiseLike<F2>): ResultPromise<S, F2> {
    return new ResultPromise(
      this.promise.then((r) => r.mapFailureAsync(mapFn)),
    );
  }

  flatMapSuccessAsync<S2>(
    mapFn: (s: S) => ResultPromise<S2, F> | PromiseLike<Result<S2, F>>,
  ): ResultPromise<S2, F> {
    return new ResultPromise(
      this.promise.then((r) => r.flatMapSuccessAsync(mapFn)),
    );
  }

  flatMapFailureAsync<F2>(
    mapFn: (f: F) => ResultPromise<S, F2> | PromiseLike<Result<S, F2>>,
  ): ResultPromise<S, F2> {
    return new ResultPromise(
      this.promise.then((r) => r.flatMapFailureAsync(mapFn)),
    );
  }

  mapSuccessAsyncCatching<S2, E = Error>(
    mapFn: (s: S) => PromiseLike<S2>,
  ): ResultPromise<S2, F | E> {
    return new ResultPromise(
      this.promise.then((r) => r.mapSuccessAsyncCatching(mapFn)),
    );
  }

  mapFailureAsyncCatching<F2, E = Error>(
    mapFn: (f: F) => PromiseLike<F2>,
  ): ResultPromise<S, F2 | E> {
    return new ResultPromise(
      this.promise.then((r) => r.mapFailureAsyncCatching(mapFn)),
    );
  }

  flatMapSuccessAsyncCatching<S2, E = Error>(
    mapFn: (s: S) => ResultPromise<S2, F> | PromiseLike<Result<S2, F>>,
  ): ResultPromise<S2, F | E> {
    return new ResultPromise(
      this.promise.then((r) => r.flatMapSuccessAsyncCatching(mapFn)),
    );
  }

  flatMapFailureAsyncCatching<F2, E = Error>(
    mapFn: (f: F) => ResultPromise<S, F2> | PromiseLike<Result<S, F2>>,
  ): ResultPromise<S, F2 | E> {
    return new ResultPromise(
      this.promise.then((r) => r.flatMapFailureAsyncCatching(mapFn)),
    );
  }

  flatMapSuccess<S2>(mapFn: (s: S) => Result<S2, F>): ResultPromise<S2, F> {
    return new ResultPromise(this.promise.then((r) => r.flatMapSuccess(mapFn)));
  }

  flatMapFailure<F2>(mapFn: (s: F) => Result<S, F2>): ResultPromise<S, F2> {
    return new ResultPromise(this.promise.then((r) => r.flatMapFailure(mapFn)));
  }

  mapFailure<F2>(mapFn: (s: F) => F2): ResultPromise<S, F2> {
    return new ResultPromise(this.promise.then((r) => r.mapFailure(mapFn)));
  }

  toResultPromise(): ResultPromise<S, F> {
    return this;
  }

  recover(recoverFn: (f: F) => S): ResultPromise<S, F> {
    return new ResultPromise(this.promise.then((r) => r.recover(recoverFn)));
  }

  recoverCatching(recoverFn: (f: F) => S): ResultPromise<S, Error> {
    return new ResultPromise(
      this.promise.then((r) => r.recoverCatching(recoverFn)),
    );
  }

  onSuccess(callbackFn: (s: S) => void): ResultPromise<S, F> {
    return new ResultPromise(this.promise.then((r) => r.onSuccess(callbackFn)));
  }

  onFailure(callbackFn: (f: F) => void): ResultPromise<S, F> {
    return new ResultPromise(this.promise.then((r) => r.onFailure(callbackFn)));
  }

  fold<R>(foldSuccessFn: (s: S) => R, foldFailureFn: (f: F) => R): Promise<R> {
    return this.promise.then((r) => r.fold(foldSuccessFn, foldFailureFn));
  }

  get(): Promise<S | F> {
    return this.promise.then((r) => r.get());
  }

  getOrDefault<S2>(defaultValue: S2): Promise<S | S2> {
    return this.promise.then((r) => r.getOrDefault(defaultValue));
  }

  getOrNull(): Promise<S | null> {
    return this.promise.then((r) => r.getOrNull());
  }

  getOrUndefined(): Promise<S | undefined> {
    return this.promise.then((r) => r.getOrUndefined());
  }

  getOrElse<S2>(elseFn: (f: F) => S2): Promise<S2 | S> {
    return this.promise.then((r) => r.getOrElse(elseFn));
  }

  getOrThrow(transformFn?: (e: F) => Error): Promise<S> {
    return this.promise.then((r) => r.getOrThrow(transformFn));
  }
}
