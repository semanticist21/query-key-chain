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

`query-key-chain` simplifies query key management in **@tanStack/react-query** by dynamically generating hierarchical arrays: `base` > `list` > `detail` > `action` > `params`. Each level can be combined or omitted.

Using the proxy API, it eases the burden of manually building query keys, providing an intuitive and scalable solution for creating unique keys effortlessly.

## Example

Here's a basic usage example:

```typescript
import {createQueryKeyFactory} from '@kkoms/query-key-chain';

// creating a query key factory
const chain = createQueryKeyFactory('user');

// generating keys
const allUsersKey = chain.all();
const userDetailKey = chain.detail(123);
const userActionKey = chain.action('edit');
const userParamsKey = chain.params({test: true});
```

This example demonstrates how to create query keys with different levels using the `query-key-chain` package.

Here's an example of how to use query-key-chain in a React project with React Query:

```typescript
// dashboard.queries.ts
import { queryOptions, useQueryClient } from "@tanstack/react-query";
import { createQueryKey } from "@kkoms/query-key-chain";

// key declaration.
// here, all keys are each unique arrays.
// so, you can use them inside query key options directly.
const chain = createQueryKey("board");

export const boardKeys = {
  // an ancestor of all keys under 'boardKeys'.
  all: chain.all(),

  // an ancestor of 'list' keys generated by 'chain.list(...)'.
  lists: chain.lists(),

  // under 'lists' keys
  // 'list', 'articles', 'article' keys are children of 'lists' key.
  list: (boardId: number) => chain.list(boardId),

  // 'articles, 'article' keys are children of 'list' key with same 'boardId'.
  articles: (boardId: number) => boardKeys.list(boardId).details(),
  article: (boardId: number, articleId: number) => boardKeys.list(boardId).detail(articleId),

  // separate keys from the 'lists' key.
  // they are separate, as they do not share 'chain.list(boardId)'.
  filter: (id: number) => chain.detail(id).action("filter"),
  download: () => chain.action("download"),
} as const;

// query options
// here, 'params' is an optional concluding method, returning readonly array of values.
export const boardService = {
  getList: (boardId: number, params: ListParams) =>
    queryOptions({
      queryKey: boardKeys.list(boardId).params(params),
      queryFn: () => fetchList(boardId, params),
    }),

  getArticle: (boardId: number, params: ArticleParams) =>
    queryOptions({
      queryKey: boardKeys.article(boardId, params.id).params(params),
      queryFn: () => fetchArticle(boardId, params),
    }),

  filter: (id: number, params: FilterParams) =>
    queryOptions({
      queryKey: boardKeys.filter(id).params(params),
      queryFn: () => fetchFiltered(id, params),
    }),

  download: (id: string) =>
    queryOptions({
      queryKey: boardKeys.download().params(id),
      queryFn: () => download(id),
    }),
  ...
};


// this will show how keys are related to each other in boardService.
// invalidating all board cached data.
queryClient.invalidateQueries({queryKey:boardKeys.all});

// invalidating all list, article cached data.
queryClient.invalidateQueries({queryKey:boardKeys.lists});

// invalidating all filter, download cached data.
queryClient.invalidateQueries({queryKey:chain.actions()});


```

You can use `keyChain` for simplicity.

```typescript
import {keyChain} from '@kkoms/query-key-chain';

// dashboard lists.
keyChain('dashboard').lists();
...

```

`createQueryKeyFactory` is also useful when you have to manage keys globally and enforce type safety.

```typescript
import {createQueryKeyFactory} from '@kkoms/query-key-chain';

// now chain behaves the same as `createQueryKey` with the base key types 'dashboard', 'user', and 'account'.
// useful when you have to manage keys globally and enforce type safety.
const keys = ['dashboard', 'user', 'account'] as const;
export const chain = createQueryKeyFactory(...keys);

// only 'dashboard', 'user', and 'account' are allowed in typescript.
chain('dashboard').lists();
chain('account').details();
chain('user').list(1).detail(1);

// @ts-expect-error it has a type error.
chain('invalid_key').list();
```

### License

This project is licensed under the MIT License.
