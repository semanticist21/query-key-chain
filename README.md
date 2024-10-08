# @kkoms/query-key-chain

A simple and functional query key management solution for React Query, using a cascading array structure.

## Table of Contents

- [@kkoms/query-key-chain](#kkomsquery-key-chain)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Note](#note)
  - [Usage](#usage)
  - [Example](#example)
    - [Basic Usage](#basic-usage)
    - [Advanced Usage](#advanced-usage)
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

`@kkoms/query-key-chain` simplifies query key management in **@tanStack/react-query** by dynamically generating hierarchical arrays: `base` > `list` > `detail` > `action` > `params`. Each level can be combined or omitted.

Using the proxy API, it eases the burden of manually building query keys, providing an intuitive and scalable solution for creating unique keys effortlessly.

## Example

### Basic Usage

```typescript
import { keyChain, createQueryKey, createQueryKeyFactory } from '@kkoms/query-key-chain';

// there are 3 ways to create a key chain.
// creating a key chain - 1.
const chain = createQueryKey('user');

// creating a key chain - 2.
const chain = keyChain('user');

// creating a key chain - 3.
const keys = ['user', 'post', 'comment'] as const;
const factory = createQueryKeyFactory(...keys);

const chain = factory('user');

// @ts-expect-error only 'user', 'post', 'comment' are allowed.
chain('invalid_key').list();


// generating keys.
chain.list('input1').detail('input2').action('input3').params('input4');

// you can manage keys by grouping.
chain.all();
chain.lists();
chain.details();
chain.actions();

// an example of hierarchical key structure.
// from top to bottom.
chain.lists();
chain.list('input1');

chain.list('input1').details();
chain.list('input1').detail('input2');

chain.list('input1').detail('input2').actions();
chain.list('input1').detail('input2').action('input3');

chain.list('input1').detail('input2').action('input3').params('input4');

// you can make an independent key chain by omitting some part of the key chain in the middle.
chain.details();
chain.detail('input2').action('input3');

```

### Advanced Usage

Here's an example of how to use `@kkoms/query-key-chain` with `@tanstack/react-query` in an actual project.

```typescript
// example/dashboard.queries.ts
import { queryOptions, useQueryClient } from "@tanstack/react-query";
import { createQueryKey } from "@kkoms/query-key-chain";

// key declaration.
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
// here, 'params' is an concluding method, returning readonly array of values.
// no further chaining is possible.
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

### License

This project is licensed under the MIT License.
