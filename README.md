# query-key-chain

A simple and functional query key management solution for React Query, using a cascading array structure.

## Table of Contents

- [query-key-chain](#query-key-chain)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Note](#note)
  - [Usage](#usage)
  - [Example](#example)
    - [Basic Usage](#basic-usage)
    - [With `@tanstack/react-query`](#with-tanstackreact-query)
    - [License](#license)

## Installation

```sh
npm install query-key-chain

yarn add query-key-chain

pnpm add query-key-chain

```

## Note

1. `TypeScript` is strongly recommended for better type safety and enhanced development experience.
2. This package uses the `Proxy API`, Ensure **your target ECMAScript version** (ES6 and above) supports `Proxies`.

## Usage

Easily generate unique query keys when using `@tanstack/react-query`.

`chain` function dynamically generates hierarchical arrays: `base` > `list` > `item` > `action` > `params`. Each level can be combined or omitted.

## Example

### Basic Usage

```typescript
import { createQueryKey } from "query-key-chain";

export const c = createQueryKeyFactory(
  ["user", "post", "comment"],
  // optional
  {
    // 'error' | 'console' | 'silent'
    severity: "error",
  }
);

const usersKey = c("user").lists();
const invalidKey = c("invalid_key"); // error

// use directly without validation.
import { chain } from "query-key-chain";

const usersKey = chain("user").lists();
```

### With `@tanstack/react-query`

```typescript
// example/dashboard.queries.ts
import { queryOptions, useQueryClient } from "@tanstack/react-query";
import { chain } from "query-key-chain";

// key declarations & invalidations.
export const getAllBoards = (params: ListParams) =>
  queryOptions({
    queryKey: chain("board").lists().params(params),
    queryFn: () => fetchBoards(params),
  });

export const getBoard = (boardId: string, params: ListParams) =>
  queryOptions({
    queryKey: chain("board").list(boardId).params(params),
    queryFn: () => fetchBoard(boardId, params),
  });

export const getBoardArticle = (
  boardId: string,
  articleId: string,
  params: ArticleParams
) =>
  queryOptions({
    queryKey: chain("board").list(boardId).item(articleId).params(params),
    queryFn: () => fetchBoardArticle(boardId, articleId, params),
  });

useMutation({
  mutationKey: chain("board").list(boardId).item(articleId).action("delete"),
  mutationFn: (params: EditParams) => deleteBoardArticle(params),
  onSuccess: () => {
    // invalidate all board articles.
    queryClient.invalidateQueries({
      queryKey: chain("board").list(boardId).items(),
    });

    // or you can just invalidate all..
    queryClient.invalidateQueries({ queryKey: chain("board").all() });
  },
});
```

### License

This project is licensed under the MIT License.
