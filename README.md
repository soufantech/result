<div align="center">
  <img src="https://avatars2.githubusercontent.com/u/61063724?s=200&v=4" width="100px">
</div>

<br />

<div align="center">
  <h1>@soufantech/result</h1>
  <p>A feature-rich Result type for TypeScript and JavaScript</p>
</div>

<br />

<div align="center">

[![typescript-image]][typescript-url] [![jest-image]][jest-url] [![npm-image]][npm-url]

</div>

**IMPORTANT NOTICE**: This is still a **WORK IN PROGRESS** (It'll be up and running soon though, we promise). If you're feeling adventurous and wanna try it anyway, please, check the [installation instructions](#installation).

## Motivation

`Result` is a type that consistently represents **either** the ***failure*** or the ***success*** of an operation. At its essence, it's just a container object that holds information on the status of the contained value (whether it's a *failure* or a *success* result).

Many JavaScript functions tend to inconsistently return `undefined` or `null` values to express failure conditions (sometimes forcing you to explicitly check for one or both). A major problem with this idiom arises when the semantics of these values do not match the semantics of the failed operation, but instead express the successful value returned from the operation (yet being `null` or `undefined`).

Returning `Result` objects is also a nice alternative for those trying to move away from indiscriminately throwing exceptions around, since many consider exceptions in most cases to be just the a disguised version of the old and (not) good `goto` statement.

`Result` goes an extra mile to provide utilities for checking its status, safely retrieving its contents and conditionally mapping its value to any other value, enabling elegant and robust control flow (if you're keen to FP).

Although they diverge in several aspects, the `Result` implementation of this module is heavily based on [Kotlin's Result](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-result/) API. Other sources of inspiration for the development of this module are [Rust's Result](https://doc.rust-lang.org/std/result/enum.Result.html) enum and [Haskell's Either](https://hackage.haskell.org/package/base-4.14.0.0/docs/Data-Either.html) type.

## Contents

- [Motivation](#motivation)
- [Contents](#contents)
- [Installation](#installation)
- [Basic usage](#basic-usage)
  - [Creation](#creation)
  - [Unboxing](#unboxing-and-type-assertions)
  - [Mapping](#mapping)
  - [Streamlined async flow](#streamlined-async-flow)
- [TypeScript and JavaScript support](#typescript-and-javascript-support)
- [API](#api)
- [Contributing](#contributing)
- [Featured](#featured)
- [Related projects](#related-projects)

## Installation

In your project folder, run:

```console
yarn add @soufantech/result
```

...or, optionally, with npm:

```console
npm install @soufantech/result
```

## Basic usage

There may be many uses for the constructs in this library, from very simple ones to very sophisticated ones. Anyway, there is no single piece of functionality in it that cannot be gradually adopted. Below are some punctual and non-exhaustive usage examples (from basic to advanced) to help you efficiently land this library in your own project.

### Creation

Let's consider a simple function that validates a string for non alphabetic characters:

```ts
import { success, failure, Result } from '@soufantech/result';

class ValidationError extends Error {}

function validate(str: string): Result<string, ValidationError> {
  return /^[a-zA-Z]*$/.test(str)
    ? success(str)
    : failure(new ValidationError('string contains non-alphabetic characters'));
}
```

As seen above, the `failure` and `success` constructors can be used to build `Result` instances. `failure` will build a `FailureResult` and `success` will build a `SuccessResult`. These two types form the discriminated `Result` union type. Except for the `get` method, both types have pretty much the same interface (have the same methods), and can (and must) be used interchangeably.

The first generic variable of the `Result` type is the type of the success value, and the second is the type of the failure value. In the example above, a `SuccessResult` is created with `success` to enclose a `string` and a `FailureResult` is created with `failure` to enclose an instance of `ValidationError`.

`SuccessResult` and `FailureResult` must not be used directly. Their types must be always referred as the `Result` union, whether returning them from a function or receiving them as arguments. Especial guard functions `isSuccess` and `isFailure` are provided to discriminate them (see the section below on [Unboxing](#unboxing)).

Apart from `success` and `failure`, there are other utility functions, like `runCatching`, that can create a `Result` for you.

`runCatching` will run a synchronous function and return a `SuccessResult` with the returned value, unless the function throws, in which case `runCatching` will return a `FailureResult` enclosing the caught exception.

```ts
import fs from 'fs';
import { runCatching } from '@soufantech/result';

// res type is Result<string, Error>
const res = runCatching(() => {
  return fs.readFileSync('file.txt', 'utf-8');
});
```

There is also an async version of `runCatching` called `runCatchingAsync`. See the section on [Streamlined async flow](#streamlined-async-flow) for more information on async operations.

### Unboxing

The `isFailure` and `isSuccess` type guards can be used to assert the correct type when calling the `get` function to unbox the enclosed value:

```ts
const res = validate('pass'); // success

res.isSuccess(); // true
res.isFailure(); // false

if (res.isSuccess()) {
  const value = res.get(); // value type is `string` ("pass")

  // ...
}
```

```ts
const res = validate('f4!L'); // failure

res.isSuccess(); // false
res.isFailure(); // true

if (res.isFailure()) {
  const value = res.get(); // value type is `ValidationError`

  // ...
}
```

You can leverage the several `get*` methods to conditionally unbox the enclosed value in just one line:

```ts
const res = validate('f4!L'); // failure

res.getOrNull(); // returns `null`
res.getOrUndefined(); // returns `undefined`
res.getOrDefault('Fails'); // returns "Fails"
res.getOrElse((err) => err.message); // returns "string contains non-alphabetic characters"
res.getOrThrow(); // throws the `ValidationError` instance
```

```ts
const res = validate('pass'); // success

res.getOrNull(); // returns "pass"
res.getOrUndefined(); // returns "pass"
res.getOrDefault('Fails'); // returns "pass"
res.getOrElse((err) => err.message); // returns "pass"
res.getOrThrow(); // returns "pass"
```

Another way to conditionally unbox the enclosed value is with the `fold` method. `fold` takes two functions as arguments: one to be executed on success (as the first argument), and one to be executed on failure (as the second argument). The value returned by `fold` will be the value returned by either of these functions.

```ts
const res = validate('pass'); // success

res.fold(
  () => 0,
  () => 1,
); // returns 0

res.fold(
  (str) => str.toUpperCase(),
  (err) => err.message.toUpperCase().replace(/\s|-/g, '_'),
); // returns "PASS"
```

```ts
const res = validate('F4!L'); // failure

res.fold(
  () => 0,
  () => 1,
); // returns 1

res.fold(
  (str) => str.toUpperCase(),
  (err) => err.message.toUpperCase().replace(/\s|-/g, '_'),
); // returns "STRING_CONTAINS_NON_ALPHABETIC_CHARACTERS"
```

`fold` is conveniently used as a mapping function to convert from one `Result` type into another (see the section on [Mapping](#mapping) for mapping functions):

```ts
// Type of res1 is `Result<number, string>`
const res1 = success<number, string>(7);

// Type of res2 is `Result<string, Error>`
const res2 = res1.fold<Result<string, Error>>(
  (s) => success(`number: ${s}`),
  (f) => failure(new Error(f))
);

res2.getOrThrow(); // returns "number: 7";
```

```ts
// Type of res1 is `Result<number, string>`
const res1 = failure<number, string>('Not a number');

// Type of res2 is `Result<string, Error>`
const res2 = res1.fold<Result<string, Error>>(
  (s) => success(`number: ${s}`),
  (f) => failure(new Error(f))
);

res2.getOrThrow(); // throws `Error` with "Not a number" message
```

If all you care is for the *side-effects*, you can use the `onSuccess` and/or the `onFailure` methods to call a callback:

```ts
function printValidate(str: string): void {
  validate('f4!L')
    .onFailure((f) => {
      console.error('FAILED:', f.message);
    })
    .onSuccess((s) => {
      console.log('PASSED:', s);
    });
}

printValidate('f4!L'); // Prints "FAILED: string contains non-alphabetic characters"
printValidate('pass'); // Prints "PASSED: pass"
```

### Mapping

Mapping methods are perhaps some of the most powerful constructs of `Result`, allowing you to conditionally transform the enclosed value (or even the `Result` itself) in a pipelined way. Mapping eliminates the need for many of the conditional statements (including exception throwing) and can be used to write whole programs, top to bottom. Nevertheless, caution is advised: the overuse of mapping can lead to programs that are hard to reason about (especially if the reader isn't well acquainted with functional programming) and memory overconsumption. That said, mapping may pay off really well (eliminating complex conditionals and guaranteeing the correct typing all along the way) if used in moderation or if the flow of your program describes a neat and unambiguous data pipeline.

**WIP**: Examples coming soon (bare with us).

### Streamlined async flow

**WIP**: Examples coming soon (bare with us).

## TypeScript and JavaScript support

This module is entirely built with TypeScript and aims to provide good, safe and useful types for TS users. Although you can use it in a pure JS project effectively, it's strongly recommended that you use it in a TS codebase if you're using its most advanced methods or simply taking this module's FP support to edge, since the provided types can save you lots of debugging and prevent nasty bugs in complex settings (mostly in long method chains).

## API

A somewhat handy description of the module API is yet to come. For now, you can reference the [result.ts](src/result.ts) and [result-utils.ts](src/result-utils.ts) files for an overview of the available methods and their signatures. The several tests contained in the [src/\__tests__](src/__tests__) directory may provide you with information on some method behavior as well.

## Contributing

If you wish to contribute to this project **in any way**, please open an issue or send a PR to this project.

## Featured

If you wrote an article on this project or mentioned it in any other publication of your authoring, please, open an issue to let us know so we can reference back your publication here.

## Related projects

- https://github.com/kittinunf/Result - Kotlin
- https://github.com/antitypical/Result - Swift
- https://gigobyte.github.io/purify/adts/Either - TypeScript

---

<div align="center">
  <sub>Built with ❤︎ by function return experts at<a href="http://soufan.com.br"> SouFan</a>
</div>

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]:  "typescript"

[npm-image]: https://img.shields.io/npm/v/@soufantech/result.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/@soufantech/result "npm"

[jest-image]: https://img.shields.io/badge/tested_with-jest-99424f.svg?style=for-the-badge&logo=jest
[jest-url]: https://github.com/facebook/jest "jest"
