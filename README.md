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
- [TypeScript and JavaScript support](#typescript-and-javascript-support)
- [API](#api)
- [Contributing](#contributing)
- [Featured](#featured)

## Installation

In your project folder, run:

```shell
yarn add @soufantech/result
```

...or, optionally, with npm:

```shell
npm -i @soufantech/result
```

## TypeScript and JavaScript support

This module is entirely built with TypeScript and aims to provide good, safe and useful types for TS users. Although you can use it in a pure JS project effectively, it's strongly recommended that you use it in a TS codebase if you're using its most advanced methods or simply taking this module's FP support to edge, since the provided types can save you lots of debugging and prevent nasty bugs in complex settings (mostly in long method chains).

## API

A somewhat handy description of the module API is yet to come. For now, you can reference the [result.ts](src/result.ts) and [result-utils.ts](src/result-utils.ts) files for an overview of the available methods and their signatures. The several tests contained in the [src/\__tests__](src/__tests__) directory may provide you with information on some method behavior as well.

## Contributing

If you wish to contribute to this project **in any way**, please open an issue or send a PR to this project.

## Featured

If you wrote an article on this project or mentioned it in any other publication of your authoring, please, open an issue to let us know so we can reference back your publication here.

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
