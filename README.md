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
    - [_createQueryKeyFactory(key: TBase\[\])_](#createquerykeyfactorykey-tbase)
    - [_createQueryKey(key: string)_](#createquerykeykey-string)
    - [_keyChain(key: string)_](#keychainkey-string)
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

`createQueryKeyFactory(...keys)`: A utility function that initializes a query key factory with multiple base keys and returns a `createQueryKey` function for accessing these keys with type safety.

`createQueryKey(baseKey)`: A utility function to initialize and create a query key chain. It sets up the `base key` and provides methods to build upon this key hierarchically.

`keyChain(baseKey)`: Another name for `createQueryKey` used for brevity.

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
import { queryOptions, useQueryClient } from "@tanstack/react-query";
import { createQueryKey } from "@kkoms/query-key-chain";

// key declaration
// here, all keys are each unique arrays.
// so, you can use them inside query key options directly.
export const boardKeys = {
  base: createQueryKey("board"),

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
  getList: (page: number, params: ListParams) =>
    queryOptions({
      queryKey: boardKeys.boardList(page).params(params),
      queryFn: () => fetchDataByPage(page, params),
    }),
  ...
};

// invalidate queries
// this will invalidate all queries inside boardKeys
queryClient.invalidateQueries({queryKey:boardKeys.all()});

// this will invalidate queries inside boardKeys
// "boardLists", "boardList", "boardDetails", "boardDetail".
//
// "modal", "doSome", "baseParams" key is not invalidated,
// as they are directly declared without list chaining.
queryClient.invalidateQueries({queryKey:boardKeys.boardLists()});

// this will invalidate 'doSome' query key.
queryClient.invalidateQueries({queryKey:boardKeys.base.actions()});


```

You can use `keyChain` for simplicity.  
`keyChain` is same with `createQueryKey`. All results are just an array of values, so with same inputs they are all related.

```typescript
import { keyChain } from "@kkoms/query-key-chain";

// dashboard lists
keyChain("dashboard").lists();
keyChain("dashboard").list(1);
keyChain("dashboard").list(1).detail(1);
keyChain("dashboard").list(1).detail(1).action("modal");

// dashboard details
keyChain("dashboard").details();
keyChain("dashboard").detail(1);
keyChain("dashboard").detail(1).action("modal");
keyChain("dashboard").detail(1).action("modal").params({ action: true });

// dashboard with only params
// invalidation only by .all()
keyChain("dashboard").params({ action: true });
```

`createQueryKeyFactory` is also useful when you have to manage keys globally and enforce type safety.

```typescript
import { createQueryKeyFactory } from "@kkoms/query-key-chain";

// now chain behaves the same as `createQueryKey` with the base key types 'dashboard', 'user', and 'account'
// useful when you have to manage keys globally and enforce type safety
export const chain = createQueryKeyFactory("dashboard", "user", "account");

// only 'dashboard', 'user', and 'account' are allowed
chain("dashboard").lists();
chain("account").details();
chain("user").list(1).detail(1);

// @ts-expect-error it has type error
chain("something").list();
```

## API

> This section focuses on query invalidation and explains the relationship between query keys in **Tanstack React Query**.
>
> If you are already familiar with React Query's query key invalidation, you may not need to read this section.

### _createQueryKeyFactory(key: TBase[])_

Initializes a query key factory with the given `base key` strings.
It returns a `createQueryKey` function for accessing these keys with type safety.

```typescript
// creates a key store with keys "1", "2", "3", and "4"
export const chain = createQueryKeyFactory("1", "2", "3", "4");

// or you can use like this
const KEYS = ["1", "2", "3", "4"] as const;
export const chain = createQueryKeyFactory(...KEYS);
```

### _createQueryKey(key: string)_

Initializes a query key chain with the given `base key` string.  
It creates an array with a proxy wrapper that provides methods to handle the following APIs.

```typescript
// ["test"]
const base = createQueryKey("test");
```

### _keyChain(key: string)_

Another name for `createQueryKey` used for brevity.

### _.all()_

The all method appends `'all'` to the base query key array.  
It is typically used to denote a global or to invalidate all related query keys.

You can invalidate queries using just `base` too,  
but for semantic purpose it is recommended to use `.all()`.

```typescript
const base = createQueryKey("test");

// ["test", "all"]
const queryKey = base.all();
```

### _.lists()_

The lists method appends `'all'` and `'#list'` to the array.

It signifies a collection of lists.

Invalidating with `.lists()` invalidates all cascading children, including those created with `.list(key: TKey)`.

```typescript
const base = createQueryKey("test");

// ["test", "all", "#list"]
const queryKey = base.lists();
```

### _.list(key: TKey)_

The list method appends `'all'`, `'#list'`, and a specific key to the array.  
This is useful for querying a specific list identified by the key.

When `.all()`, `.lists()` is invalidated, both the key itself and all cascading children are also invalidated.

```typescript
const base = createQueryKey("test");

// ["test", "all", "#list", "list-test"]
const queryKey = base.list("list-test");
```

### _.details()_

The details method appends `'#detail'` to the preceding array.  
It is used to represent a collection of detailed items.

`'all'` is always included as the next segment after the base key, regardless of whether preceding chains like `list` have been used or not.

Invalidating with `.details()` invalidates all cascading children, including those created with `.detail(key: TKey)`.

Examples of usage:

`base.details()`: Creates a query key `['test', 'all', '#detail']`.  
Invalidating `.all()` or `.details()` affects this key directly.

`base.list("list-test").details()`: Creates a specific query key under a list,
e.g., ['test', 'all', '#list', 'list-test', '#detail'].

In the above example, invalidating `list("list-test")` or any preceding chain part cascades down, invalidating `detail` as well.

```typescript
const base = createQueryKey("test");

// ["test", "all", "#list", "list-test", "#detail"]
const queryKey = base.list("list-test").details();

// ["test", "all", "#detail"]
const queryKey2 = base.details();
```

### _.detail(key: TKey)_

The detail method appends `'#detail'` and a specific key to the preceding array.  
This is useful for querying detailed information identified by the key.

`'all'` is always included as the next segment after the base key, regardless of whether preceding chains like `list` have been used or not.

When `.all()`, `.details()` is invalidated, both the key itself and all cascading children are also invalidated.

`base.detail("detail-test")`: Creates a query key ['test', 'all', '#detail', 'detail-test'].  
`base.list("list-test").detail("detail-test")`: Creates a more specific query key under a list.

Invalidating any part of the chain invalidates all cascading children.

```typescript
const base = createQueryKey("test");

// ["test", "all", "#list", "list-test", "#detail", "detail-test"]
const queryKey = base.list("list-test").detail("detail-test");

// ["test", "all", "#detail", "detail-test"]
const queryKey2 = base.detail("detail-test");
```

### _.actions()_

The actions method appends `'#action'` to the preceding array.  
It is used to represent a collection of actions.

`'all'` is always included as the next segment after the base key, regardless of whether preceding chains like `list`, `detail` have been used or not.

Invalidating with `.actions()` invalidates all cascading children, including those created with `.action(key: TKey)`.

```typescript
const base = createQueryKey("test");

// ["test", "all", "#list", "list-test", "#detail", "detail-test", "#action"]
const queryKey = base.list("list-test").detail("detail-test").actions();

// ["test", "all", "#action"]
const queryKey2 = base.actions();
```

### _.action(key: TKey)_

The action method appends `'#action'` and a specific key to the preceding array.  
This is useful for querying a specific action identified by the key.

`'all'` is always included as the next segment after the base key, regardless of whether preceding chains like `list`, `detail` have been used or not.

When `.all()`, `.actions()` is invalidated, both the key itself and all cascading children are also invalidated.

`base.action("action-test")`: Creates a query key ['test', 'all', '#action', 'action-test'].
`base.list("list-test").detail("detail-test").action("action-test")`: Creates a more specific query key under list, detail.

```typescript
const base = createQueryKey("test");

// ["test", "all", "#list", "list-test", "#detail", "detail-test", "#action", "action-test"]
const queryKey = base
  .list("list-test")
  .detail("detail-test")
  .action("action-test");

// ["test", "all", "#action", "action-test"]
const queryKey = base.action("action-test");
```

### _.params(params: TParams)_

The params method appends parameters to the query key. This is useful for adding query parameters to the key.

When the parent query key or any preceding part of the chain (such as `list`, `detail`, or `action`) is invalidated, this key will be also invalidated.

As this is the final element of the array, no further cascading occurs.

```typescript
const base = createQueryKey("test");

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
