# @kkoms/query-key-chain

A simple and functional query key management solution for React Query, using a cascading array structure.

## Table of Contents

- [@kkoms/query-key-chain](#kkomsquery-key-chain)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Note](#note)
  - [Usage](#usage)
  - [Example](#example)
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

`query-key-chain` simplifies the management of query keys in **@tanStack/react-query** through a hierarchical, functional approach. It dynamically generates arrays representing query keys, structured in a clear hierarchy: `base` > `list` > `detail` > `action` > `params`. Each level can be independently combined or omitted, offering flexibility in creating query chains. Utilizing the proxy API, `query-key-chain` ensures an intuitive and scalable method for managing complex query keys, allowing you to effortlessly generate unique query keys as needed.

## Example

Here's a basic usage example:

```typescript
import { createQueryKeyFactory } from "@kkoms/query-key-chain";

// Create a query key factory
const chain = createQueryKeyFactory("user");

// Generate keys
const allUsersKey = chain.all(); // ['user', {level: '#all'}]
const userDetailKey = chain.detail(123); // ['user', {level: '#detail'}, 123]
const userActionKey = chain.action("edit"); // ['user', {level: '#action'}, 'edit']
const userParamsKey = chain.params({ test: true }); // ['user', {level: '#params'}, { test: true }]

console.log(allUsersKey); // Output: ['user', {level: '#all'}]
console.log(userDetailKey); // Output: ['user', {level: '#detail'}, 123]
console.log(userActionKey); // Output: ['user', {level: '#action'}, 'edit']
```

This example demonstrates how to create query keys with different levels using the `query-key-chain` package.

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

### License

This project is licensed under the MIT License.
