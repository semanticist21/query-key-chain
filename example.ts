// dashboard.queries.ts
import { queryOptions } from "@tanstack/react-query";
import { createQueryFactory } from "@kkoms/query-key-chain";

// key declaration
// here, all keys are each unique arrays
// so, you can use them as query key directly.
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
// as they are directly declared without list chaining.
queryClient.invalidateQueries(boardKeys.boardLists());

// this will invalidate 'doSome' query key.
queryClient.invalidateQueries(boardKeys.base.actions());
