import { KEY_ATTACH, TKey } from "./key";

export interface BaseKey<TBase extends string> extends ReadonlyArray<TBase> {
  all: () => [TBase, typeof KEY_ATTACH.all];

  lists: () => [TBase, typeof KEY_ATTACH.all, typeof KEY_ATTACH.list];
  list: <TListKeyValue extends TKey>(
    key: TListKeyValue
  ) => ListKeys<TBase, TListKeyValue>;

  details: () => [TBase, typeof KEY_ATTACH.all, typeof KEY_ATTACH.detail];
  detail: <TDetailKeyValue extends TKey>(
    key: TDetailKeyValue
  ) => DetailKeys<TBase, never, TDetailKeyValue>;

  actions: () => [TBase, typeof KEY_ATTACH.all, typeof KEY_ATTACH.action];
  action: <TActionKeyValue extends TKey>(
    action: TActionKeyValue
  ) => ActionKeys<TBase, never, never, TActionKeyValue>;

  params: <TParams = unknown>(
    params: TParams
  ) => ParamsKeys<TBase, never, never, never, TParams>;
}

// list
export interface ListKeys<TBase extends string, TList extends TKey = never>
  extends ReadonlyArray<TBase> {
  details: () => DetailKeys<TBase, TList, never>;
  detail: <TDetailKeyValue extends TKey>(
    key: TDetailKeyValue
  ) => DetailKeys<TBase, TList, TDetailKeyValue>;

  actions: () => ActionKeys<TBase, TList, never, never>;
  action: <TActionKeyValue extends TKey>(
    action: TActionKeyValue
  ) => ActionKeys<TBase, TList, never, TActionKeyValue>;

  params: <TParams = unknown>(
    params: TParams
  ) => ParamsKeys<TBase, TList, never, never, TParams>;
}

// detail
export interface DetailKeys<
  TBase extends string,
  TList extends TKey = never,
  TDetail extends TKey = never
> extends ReadonlyArray<TBase> {
  actions: () => ActionKeys<TBase, TList, TDetail, never>;
  action: <TActionKeyValue extends TKey>(
    action: TActionKeyValue
  ) => ActionKeys<TBase, TList, TDetail, TActionKeyValue>;

  params: <TParams = unknown>(
    params: TParams
  ) => ParamsKeys<TBase, TList, TDetail, never, TParams>;
}

// action
export interface ActionKeys<
  TBase extends string,
  TList extends TKey = never,
  TDetail extends TKey = never,
  TAction extends TKey = never
> extends ReadonlyArray<TBase> {
  params: <TParams = unknown>(
    params: TParams
  ) => ParamsKeys<TBase, TList, TDetail, TAction, TParams>;
}

// params
export interface ParamsKeys<
  TBase extends string,
  TList extends TKey = never,
  TDetail extends TKey = never,
  TAction extends TKey = never,
  TParams = unknown
> extends ReadonlyArray<TBase | TList | TDetail | TAction | TParams> {}
