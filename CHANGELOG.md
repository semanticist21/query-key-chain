# Changelog

All notable changes to this project will be documented in this file.

## [0.7.0] - 2024-09-20

- Changed
  - `lists()`, `details()`, `actions()` now returns an array that is not chainable.
  - key inputs other than primitive values are now allowed.
  - a type annotation of chains only represents its base key.

## [0.6.2] - 2024-08-21

- Changed

added items at each step is now an object instead of string.

## [0.5.2] - 2024-08-05

- Changed

Refactored the code.
`.all()` returns `#all` instead of `all`.

## [0.5.1] - 2024-07-14

- Changed

Changed the type of Arrays to `ReadonlyArray` from `Readonly<Array<T>>`

## [0.4.5] - 2024-07-08

- Changed

Changed appended values from `list`, `detail`, `action` to `#list`, `#detail`, `#action` to avoid clashing with key inputs.

- Fixed

Fixed a bug in the typing for `createQueryKeyFactory`.

## [0.4.2] - 2024-07-08

- Added

`createQueryKeyFactory` which is useful when you want to create a query key that enforce a certain keys.

- Changed

`createQueryFactory` has been renamed to `createQueryKey`
`queryChain` has been renamed to `keyChain`

Type names ends with `QueryArray` has been changed to name with ending `Key` or `Keys`

Updated README.md.
