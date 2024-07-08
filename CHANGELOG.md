# Changelog

All notable changes to this project will be documented in this file.

## [0.4.2] - 2024-07-08

- Added

`createQueryKeyFactory` which is useful when you want to create a query key that enforce a certain keys.

- Changed

`createQueryFactory` has been renamed to `createQueryKey`
`queryChain` has been renamed to `keyChain`

Type names ends with `QueryArray` has been changed to name with ending `Key` or `Keys`

Updated README.md.

## [0.4.5] - 2024-07-08

- Changed

Changed appended values from `list`, `detail`, `action` to `#list`, `#detail`, `#action` to avoid clashing with key inputs.

- Fixed

Fixed a bug in the typing for `createQueryKeyFactory`.
