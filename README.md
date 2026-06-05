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
2. This package uses the `Proxy API`. Ensure **your target ECMAScript version** (ES6 and above) supports `Proxy`.

## Usage

Easily generate unique query keys when using `@tanstack/react-query`.

The `chain` function dynamically generates hierarchical arrays:
`all` > `list` > `item` > `action` > `params`.
Each level can be combined or omitted.
You can get grouped keys using methods such as `lists`, `items`, and `actions`.

The `createChainFactory` function creates a validated chain factory when you want to restrict base keys to a known set.

## Example

### Basic Usage

```typescript
import { chain, createChainFactory } from "query-key-chain";

export const c = createChainFactory(
  ["user", "post", "comment"],
  // optional
  {
    // 'error' | 'console' | 'silent'
    severity: "error",
  }
);

const validatedUsersKey = c("user").lists().params({ foo: "true" });
const invalidKey = c("invalid_key"); // error

// without validation.
const usersKey = chain("user").lists().params({ foo: "true" });
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
  mutationFn: (params: EditParams) => deleteBoardArticle(params),
  onSuccess: () => {
    // this will invalidate board & related articles.
    queryClient.invalidateQueries({
      queryKey: chain("board").list(boardId),
    });

    // or you can just invalidate all..
    queryClient.invalidateQueries({ queryKey: chain("board").all() });
  },
});
```

## License

This project is licensed under the MIT License.
