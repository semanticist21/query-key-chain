# @kkoms/query-key-chain

A simple and functional query key management solution for React Query, using a cascading array structure.

## Table of Contents

- [@kkoms/query-key-chain](#kkomsquery-key-chain)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Note](#note)
  - [Usage](#usage)
    - [Key Components](#key-components)
    - [Parameters](#parameters)
    - [Type Safety](#type-safety)
  - [Example](#example)
  - [API](#api)
    - [_createQueryKey(key: string)_](#createquerykeykey-string)
    - [_queryChain(key: string)_](#querychainkey-string)
    - [_.all()_](#all)
    - [_.lists()_](#lists)
    - [_.list(key: TKey)_](#listkey-tkey)
    - [_.details()_](#details)
    - [_.detail(key: TKey)_](#detailkey-tkey)
    - [_.actions()_](#actions)
    - [_.action(key: TKey)_](#actionkey-tkey)
    - [_.params(params: TParams)_](#paramsparams-tparams)
  - [License](#license)

## Installation

```sh
npm install @kkoms/query-key-chain

yarn add @kkoms/query-key-chain

pnpm add @kkoms/query-key-chain

```

## Note

1. `TypeScript` is strongly recommended for better type safety and enhanced development experience.
2. This package uses the `Proxy API`, Ensure **your target ECMAScript version** (ES6 and above) supports `Proxies`.

## Usage

`query-key-chain` provides an efficient method for managing query keys in **TanStack React Query** using a hierarchical and functional approach.

Each chain produces an array, with methods appending their respective segments to it.

By leveraging the proxy API, `query-key-chain` attaches methods representing different query key levels, ensuring a clean, intuitive, and scalable API for complex query key management.

### Key Components

`createQueryKey(baseKey)`: A utility function to initialize and create a query key chain. It sets up the `base key` and provides methods to build upon this key hierarchically.

`queryChain(baseKey)`: It is same with `createQueryKey`

This package supports a variety of functions to build complex query keys:

`.all()`: Represents the global or overarching query.  
`.lists()` and `.list(key)`: Manage collections and specific lists.  
`.details()` and `.detail(key)`: Handle detailed items and specific details.  
`.actions()` and `.action(key)`: Define collections of actions and specific actions.  
`.params(params)`: Append parameters to the query key for more specificity.

### Parameters

`baseKey` is a string which is base of the query key hierarchy. It serves as the foundation upon which further query keys are appended.

`key` is a primitive type like string, number, boolean etc.

`params` can be anything containing additional parameters that can be used to refine or modify the query.

All function results are simply unique extensions of a single array, making them functionally equivalent to using a pure array.

### Type Safety

With TypeScript, each method call in the chain ensures type safety, producing a read-only array that reflects the current state of the chain. For example:

```typescript
const queryKey = base
  .list("list-test")
  .detail("detail-test")
  .action("action-test");
// type Readonly<QueryActionArray<"test", "list-test", "detail-test", "action-test">>
```

## Example

Here's an example of how to use query-key-chain in a React project with React Query:

```typescript
// dashboard.queries.ts
import { queryOptions } from "@tanstack/react-query";
import { createQueryFactory } from "@kkoms/query-key-chain";

// key declaration
// here, all keys are each unique arrays.
// so, you can use them inside query key options directly.
export const boardKeys = {
  base: createQueryFactory("board"),

  all: () => boardKeys.base.all(),

  // with 'list' keys
  boardLists: () => boardKeys.base.lists(),
  boardList: (idx: number) => boardKeys.base.list(idx),

  boardDetails: (idx: number) => boardKeys.boardList(idx).details(),
  boardDetail: (idx: number, detail: string) => boardKeys.boardList(idx).detail(detail),

  // separate keys
  modal: (id: string) =>
    boardKeys.base.detail(id).action("modal"),

  doSome: (params: {action:boolean}) => boardKeys.base.action("doSome").params(params),

  baseParams: (params: {test:boolean}) => boardKeys.base.params(params),
} as const;

// query options
export const boardService = {
  getList: (page: number) =>
    queryOptions({
      queryKey: boardKeys.boardList(page),
      queryFn: () => fetchDataByPage(page),
    }),
  ...
};

// invalidate queries
// this will invalidate all queries inside boardKeys
queryClient.invalidateQueries(boardKeys.all());

// this will invalidate queries inside boardKeys
// "boardLists", "boardList", "boardDetails", "boardDetail".
//
// "modal", "doSome", "baseParams" key is not invalidated,
// as they are directly declared without list chaining.
queryClient.invalidateQueries(boardKeys.boardLists());

// this will invalidate 'doSome' query key.
queryClient.invalidateQueries(boardKeys.base.actions());

```

You can use `queryChain` for simplicity.  
`queryChain` is same with `createQueryFactory`. All results are just an array of values, so with same inputs they are all related.

```typescript
import { queryChain } from "@kkoms/query-key-chain";

// dashboard lists
queryChain("dashboard").lists();
queryChain("dashboard").list(1);
queryChain("dashboard").list(1).detail(1);
queryChain("dashboard").list(1).detail(1).action("modal");

// dashboard details
queryChain("dashboard").details();
queryChain("dashboard").detail(1);
queryChain("dashboard").detail(1).action("modal");
queryChain("dashboard").detail(1).action("modal").params({ action: true });

// dashboard with only params
// invalidation only by .all()
queryChain("dashboard").params({ action: true });
```

## API

If you are already familiar with React Query's query key invalidation, you may not need to read this section.

### _createQueryKey(key: string)_

Initializes a query key chain with the given `base key` string.  
It creates an array with a proxy wrapper that provides methods to handle the following APIs.

```typescript
// index.ts
// ['test']
const base = createQueryFactory("test");
```

### _queryChain(key: string)_

It is same with `createQueryFactory`

### _.all()_

The all method appends `'all'` to the base query key array.  
It is typically used to denote a global or to invalidate all related query keys.

You can invalidate queries using just `base` too,  
but for semantic purpose it is recommended to use `.all()`.

```typescript
// index.ts
const base = createQueryFactory("test");

// ['test', 'all']
const queryKey = base.all();
```

### _.lists()_

The lists method appends `'all'` and `'list'` to the array.

It signifies a collection of lists.

Invalidating with `.lists()` invalidates all cascading children, including those created with `list`.

```typescript
// index.ts
const base = createQueryFactory("test");

// ['test', 'all', 'list']
const queryKey = base.lists();
```

### _.list(key: TKey)_

The list method appends `'all'`, `'list'`, and a specific key to the array.  
This is useful for querying a specific list identified by the key.

When `.all()`, `.lists()` is invalidated, all cascading children are also invalidated.

```typescript
const base = createQueryFactory("test");

// ['test', 'all', 'list', 'list-test']
const queryKey = base.list("list-test");
```

### _.details()_

The details method appends `'detail'` to the preceding array.  
It is used to represent a collection of detailed items.

`'all'` is always included as the next segment after the base key, regardless of whether preceding chains like `list` have been used or not.

Invalidating with `.details()` invalidates all cascading children, including those created with `detail`.

Examples of usage:

`base.details()`: Creates a query key `['test', 'all', 'detail']`.  
Invalidating `.all()` or `.details()` affects this key directly.

`base.list(id).details()`: Creates a specific query key under a list,
e.g., ['test', 'all', 'list', 'list-test', 'detail'].

In the above example, invalidating `list("list-test")` or any preceding chain part cascades down, invalidating `detail` as well.

```typescript
const base = createQueryFactory("test");

// ['test', 'all', 'list', 'list-test', 'detail']
const queryKey = base.list("list-test").details();

// ['test', 'all', 'detail']
const queryKey2 = base.details();
```

### _.detail(key: TKey)_

The detail method appends `detail` and a specific key to the preceding array.  
This is useful for querying detailed information identified by the key.

`'all'` is always included as the next segment after the base key, regardless of whether preceding chains like `list` have been used or not.

When `.all()`, `.details()` is invalidated, all cascading children are also invalidated.

`base.detail("detail-test")`: Creates a query key ['test', 'all', 'detail', 'detail-test'].  
`base.list("list-test").detail("detail-test")`: Creates a more specific query key under a list.

Invalidating any part of the chain invalidates all cascading children.

```typescript
const base = createQueryFactory("test");

// ['test', 'all', 'list', 'list-test', 'detail', 'detail-test']
const queryKey = base.list("list-test").detail("detail-test");

// ['test', 'all', 'detail', 'detail-test']
const queryKey2 = base.detail("detail-test");
```

### _.actions()_

The actions method appends `'action'` to the preceding array.  
It is used to represent a collection of actions.

`'all'` is always included as the next segment after the base key, regardless of whether preceding chains like `list`, `detail` have been used or not.

Invalidating with `.actions()` invalidates all cascading children, including those created with `action`.

```typescript
const base = createQueryFactory("test");

// ['test', 'all', 'list', 'list-test', 'detail', 'detail-test', 'action']
const queryKey = base.list("list-test").detail("detail-test").actions();

// ['test', 'all', 'action']
const queryKey2 = base.actions();
```

### _.action(key: TKey)_

The action method appends `action` and a specific key to the preceding array.  
This is useful for querying a specific action identified by the key.

`'all'` is always included as the next segment after the base key, regardless of whether preceding chains like `list`, `detail` have been used or not.

When `.all()`, `.actions()` is invalidated, all cascading children are also invalidated.

`base.action("action-test")`: Creates a query key ['test', 'all', 'action', 'action-test'].
`base.list("list-test").detail("detail-test").action("action-test")`: Creates a more specific query key under list, detail.

```typescript
const base = createQueryFactory("test");

// ['test', 'all', 'list', 'list-test', 'detail', 'detail-test', 'action', ''action-test']
const queryKey = base
  .list("list-test")
  .detail("detail-test")
  .action("action-test");

// ['test', 'all', 'action', 'action-test']
const queryKey = base.action("action-test");
```

### _.params(params: TParams)_

The params method appends parameters to the query key. This is useful for adding query parameters to the key.

When the parent query key or any preceding part of the chain (such as `list`, `detail`, or `action`) is invalidated, this key will be also invalidated.

As this is the final element of the array, no further cascading occurs.

```typescript
const base = createQueryFactory("test");

// ['test', 'all', 'list', 'list-test', 'detail', 'detail-test', 'action', ''action-test', { test: 3 }]
const queryKey = base
  .list("list-test")
  .detail("detail-test")
  .action("action-test")
  .params({ test: 3 });

// ['test', 'all', 'action', 'action-test', { test: 3 }]
const queryKey = base.action("action-test").params({ test: 3 });

// or you can use just like this.
// bound to only 'all' invalidation.
// ['test', 'all', { test: 3 }]
const queryKey2 = base.params({ test: 3 });
```

## License

This project is licensed under the MIT License.
