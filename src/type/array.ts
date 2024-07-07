import { TKey } from "./key";

export interface BaseQuery<TBase extends string> extends Array<TBase> {
  all: () => Readonly<QueryAllArray<TBase>>;

  lists: () => Readonly<QueryListArray<TBase>>;
  list: <TListKeyValue extends TKey>(
    key: TListKeyValue
  ) => Readonly<QueryListArray<TBase, TListKeyValue>>;

  details: () => Readonly<QueryDetailArray<TBase, never, never>>;
  detail: <TDetailKeyValue extends TKey>(
    key: TDetailKeyValue
  ) => Readonly<QueryDetailArray<TBase, never, TDetailKeyValue>>;

  actions: () => Readonly<QueryActionArray<TBase, never, never, never>>;
  action: <TActionKeyValue extends TKey>(
    action: TActionKeyValue
  ) => Readonly<QueryActionArray<TBase, never, never, TActionKeyValue>>;

  params: <TParams = unknown>(
    params: TParams
  ) => Readonly<QueryParamsArray<TBase, never, never, never, TParams>>;
}

// all
export type QueryAllArray<TBase extends string> = Array<TBase | "all">;

// list
export interface QueryListArray<
  TBase extends string,
  TList extends TKey = never
> extends Array<TBase> {
  all: () => Readonly<Array<TBase | "all">>;

  details: () => Readonly<QueryDetailArray<TBase, TList, never>>;
  detail: <TDetailKeyValue extends TKey>(
    key: TDetailKeyValue
  ) => Readonly<QueryDetailArray<TBase, TList, TDetailKeyValue>>;

  actions: () => Readonly<QueryActionArray<TBase, TList, never, never>>;
  action: <TActionKeyValue extends TKey>(
    action: TActionKeyValue
  ) => Readonly<QueryActionArray<TBase, TList, never, TActionKeyValue>>;

  params: <TParams = unknown>(
    params: TParams
  ) => Readonly<QueryParamsArray<TBase, TList, never, never, TParams>>;
}

// detail
export interface QueryDetailArray<
  TBase extends string,
  TList extends TKey = never,
  TDetail extends TKey = never
> extends Array<TBase> {
  actions: () => Readonly<QueryActionArray<TBase, TList, TDetail, never>>;
  action: <TActionKeyValue extends TKey>(
    action: TActionKeyValue
  ) => Readonly<QueryActionArray<TBase, TList, TDetail, TActionKeyValue>>;

  params: <TParams = unknown>(
    params: TParams
  ) => Readonly<QueryParamsArray<TBase, TList, TDetail, never, TParams>>;
}

// action
export interface QueryActionArray<
  TBase extends string,
  TList extends TKey = never,
  TDetail extends TKey = never,
  TAction extends TKey = never
> extends Array<TBase> {
  params: <TParams = unknown>(
    params: TParams
  ) => Readonly<QueryParamsArray<TBase, TList, TDetail, TAction, TParams>>;
}

// params
export interface QueryParamsArray<
  TBase extends string,
  TList extends TKey = never,
  TDetail extends TKey = never,
  TAction extends TKey = never,
  TParams = unknown
> extends Array<TBase | TList | TDetail | TAction | TParams> {}
