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
