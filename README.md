# @kkoms/query-key-chain

A simple and functional query key management solution for React Query, using a cascading array structure.

## Table of Contents

- [@kkoms/query-key-chain](#kkomsquery-key-chain)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Example](#example)
  - [API](#api)
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

## Usage

`query-key-chain` provides a straightforward way to manage query keys in a hierarchical and functional manner.  
The result of each chain is an array, with each method appending its respective segment to the array.  
The chain utilizes proxy objects to seamlessly attach methods that represent different levels of query keys, ensuring a clean and intuitive API.

This package supports a variety of functions to build complex query keys:

`.all()`: Represents the global or overarching query.  
`.lists()` and `.list(key)`: Manage collections and specific lists.  
`.details()` and `.detail(key)`: Handle detailed items and specific details.  
`.actions()` and `.action(key)`: Define collections of actions and specific actions.  
`.params(params)`: Append parameters to the query key for more specificity.

`baseKey` is a string which is base of the query key hierarchy. It serves as the foundation upon which further query keys are appended.

`key` is a primitive type like string, number, boolean etc.

`params` can be anything containing additional parameters that can be used to refine or modify the query.

All function results are simply unique extensions of a single array, making them functionally equivalent to using a pure array.

## Example

Here's an example of how to use query-key-chain in a React project with React Query:

```typescript
// dashboard.queries.ts
import { queryOptions } from "@tanstack/react-query";
import { createQueryFactory } from "@kkoms/query-key-chain";

// key declaration
export const boardKeys = {
  base: createQueryFactory("board"),

  all: () => boardKeys.base.all(),

  boardLists: () => boardKeys.base.lists(),
  boardList: (idx: number) => boardKeys.base.list(idx),

  boardDetails: (idx: number) => boardKeys.boardList(idx).details(),
  boardDetail: (idx: number, detail: string) => boardKeys.boardList(idx).detail(detail),

  modal: (id: string) =>
    boardKeys.base.detail(id).action("modal"),

  doSome: (params: {action:boolean}) => boardKeys.base.action("doSome").params(params),
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
// "modal", "doSome" key is not invalidated,
// as it directly declared without list chaining.
queryClient.invalidateQueries(boardKeys.boardLists());

// this will invalidate 'doSome' query key.
queryClient.invalidateQueries(boardKeys.base.actions());


```

You can use `queryChain` for simplicity.  
`queryChain` is same with `createQueryFactory`. All results are just an array of values, so with same inputs they are all related.

```typescript
import { queryChain } from "@kkoms/query-key-chain";

queryChain("dashboard").lists();
queryChain("dashboard").list(1);
queryChain("dashboard").details();
queryChain("dashboard").detail(1);
queryChain("dashboard").detail(1).action("modal");
queryChain("dashboard").detail(1).action("modal").params({ action: true });
queryChain("dashboard").params({ action: true });
```

## API

If you are already familiar with React Query's query key invalidation, you may not need to read this section.

### _.all()_

The all method appends all to the query key.  
It is typically used to denote a global or invalidating all related query keys.

You can invalidate queries using just `base` too,  
but for semantic purpose it is recommended to use _`.all()`_.

```typescript
// index.ts
const base = createQueryFactory("test");
const queryKey = base.all(); // ['test', 'all']
```

### _.lists()_

The lists method appends all and list to the query key.

It signifies a collection of lists. When _`all()`_ is invalidated, all cascading children, including those created with lists, are invalidated as well.

```typescript
// index.ts
const base = createQueryFactory("test");
const queryKey = base.lists(); // ['test', 'all', 'list']
```

### _.list(key: TKey)_

The list method appends all, list, and a specific key to the query key.  
This is useful for querying a specific list identified by the key.

When _`lists()`_ is invalidated, It is invalidated together.

```typescript
const base = createQueryFactory("test");
const queryKey = base.list("list-test"); // ['test', 'all', 'list', 'list-test']
```

### _.details()_

The details method appends all and detail to the query key.  
It is used to represent a collection of detailed items.

When \_all() is invalidated, all cascading children, including those created with details, are invalidated as well.

Examples of usage:

`base.details()`: Creates a query key `['test', 'all', 'detail']`.  
Invalidating all() or details() affects this key directly.

`base.list(id).details()`: Creates a specific query key under a list,
e.g., ['test', 'all', 'list', 'list-test', 'detail'].

In the above example, invalidating list("list-test") or any preceding chain part cascades down, invalidating details as well.

```typescript
const base = createQueryFactory("test");
const queryKey = base.details(); // ['test', 'all', 'detail']
```

### _.detail(key: TKey)_

The detail method appends all, detail, and a specific key to the query key.  
This is useful for querying detailed information identified by the key.

When details() or any preceding part of the chain is invalidated, all cascading children, including detail, are also invalidated.

`base.detail("detail-test")`: Creates a query key ['test', 'all', 'detail', 'detail-test'].  
`base.list("list-test").detail("detail-test")`: Creates a more specific query key under a list.

Invalidating any part of the chain invalidates all cascading children.

```typescript
const base = createQueryFactory("test");
const queryKey = base.detail("detail-test"); // ['test', 'all', 'detail', 'detail-test']
```

### _.actions()_

The actions method appends all and action to the query key.  
It is used to represent a collection of actions.

When all() or any preceding part of the chain (such as list or detail) is invalidated, all cascading children, including those created with actions, are also invalidated.

```typescript
const base = createQueryFactory("test");
const queryKey = base.actions(); // ['test', 'all', 'action']
```

### _.action(key: TKey)_

The action method appends all, action, and a specific key to the query key.  
This is useful for querying a specific action identified by the key.

`base.action("action-test")`: Creates a query key ['test', 'all', 'action', 'action-test'].
`base.list("list-test").detail("detail-test").action("action-test")`: Creates a more specific query key under list, detail.

When actions() or any preceding part of the chain (such as list or detail) is invalidated, all cascading children, including those created with action, are also invalidated.

```typescript
const base = createQueryFactory("test");
const queryKey = base.action("action-test"); // ['test', 'all', 'action', 'action-test']
```

### _.params(params: TParams)_

The params method appends parameters to the query key. This is useful for adding query parameters to the key.

When the parent query key or any preceding part of the chain (such as list, detail, or action) is invalidated, this key will be also invalidated.
As this is the final element of the array, no cascading furthermore.

```typescript
const base = createQueryFactory("test");
const queryKey = base.action("action-test").params({ test: 3 });
// ['test', 'all', 'action', 'action-test', { test: 3 }]
```

## License

This project is licensed under the MIT License.
