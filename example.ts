// dashboard.queries.ts
import { queryOptions } from "@tanstack/react-query";
import { createQueryFactory } from "./src";

// key declaration
export const boardKeys = {
  base: createQueryFactory("board"),

  all: () => boardKeys.base.all(),

  lists: () => boardKeys.base.lists(),
  list: (idx: number) => boardKeys.base.list(idx),

  details: (idx: number) => boardKeys.list(idx).details(),
  detail: (idx: number, detail: string) => boardKeys.list(idx).detail(detail),

  modal: (idx: number, detail: string) =>
    boardKeys.detail(idx, detail).action("modal"),

  doSome: (params: {action:boolean}) => boardKeys.base.action("doSome").params(params),
} as const;

// query options
export const boardService = {
  getList: (page: number) =>
    queryOptions({
      queryKey: boardKeys.list(page),
      queryFn: () => fetchDataByPage(page),
    }),
  ...
};

// invalidate queries
// this will invalidate all queries inside boardKeys
queryClient.invalidateQueries(boardKeys.all());

// this will invalidate queries inside boardKeys
// lists, list, details, detail, modal
// "doSome" key is not invalidated because
// list, detail, details works in the same way.
queryClient.invalidateQueries(boardKeys.lists());

// this will invalidate 'doSome' query key.
queryClient.invalidateQueries(boardKeys.base.actions());
