import { TKey } from "./key";

export interface BaseKey<TBase extends string> extends Array<TBase> {
  all: () => Readonly<AllKeys<TBase>>;

  lists: () => Readonly<ListKeys<TBase>>;
  list: <TListKeyValue extends TKey>(
    key: TListKeyValue
  ) => Readonly<ListKeys<TBase, TListKeyValue>>;

  details: () => Readonly<DetailKeys<TBase, never, never>>;
  detail: <TDetailKeyValue extends TKey>(
    key: TDetailKeyValue
  ) => Readonly<DetailKeys<TBase, never, TDetailKeyValue>>;

  actions: () => Readonly<ActionKeys<TBase, never, never, never>>;
  action: <TActionKeyValue extends TKey>(
    action: TActionKeyValue
  ) => Readonly<ActionKeys<TBase, never, never, TActionKeyValue>>;

  params: <TParams = unknown>(
    params: TParams
  ) => Readonly<ParamsKeys<TBase, never, never, never, TParams>>;
}

// all
export type AllKeys<TBase extends string> = Readonly<Array<TBase | "all">>;

// list
export interface ListKeys<TBase extends string, TList extends TKey = never>
  extends Array<TBase> {
  all: () => Readonly<Array<TBase | "all">>;

  details: () => Readonly<DetailKeys<TBase, TList, never>>;
  detail: <TDetailKeyValue extends TKey>(
    key: TDetailKeyValue
  ) => Readonly<DetailKeys<TBase, TList, TDetailKeyValue>>;

  actions: () => Readonly<ActionKeys<TBase, TList, never, never>>;
  action: <TActionKeyValue extends TKey>(
    action: TActionKeyValue
  ) => Readonly<ActionKeys<TBase, TList, never, TActionKeyValue>>;

  params: <TParams = unknown>(
    params: TParams
  ) => Readonly<ParamsKeys<TBase, TList, never, never, TParams>>;
}

// detail
export interface DetailKeys<
  TBase extends string,
  TList extends TKey = never,
  TDetail extends TKey = never
> extends Array<TBase> {
  actions: () => Readonly<ActionKeys<TBase, TList, TDetail, never>>;
  action: <TActionKeyValue extends TKey>(
    action: TActionKeyValue
  ) => Readonly<ActionKeys<TBase, TList, TDetail, TActionKeyValue>>;

  params: <TParams = unknown>(
    params: TParams
  ) => Readonly<ParamsKeys<TBase, TList, TDetail, never, TParams>>;
}

// action
export interface ActionKeys<
  TBase extends string,
  TList extends TKey = never,
  TDetail extends TKey = never,
  TAction extends TKey = never
> extends Array<TBase> {
  params: <TParams = unknown>(
    params: TParams
  ) => Readonly<ParamsKeys<TBase, TList, TDetail, TAction, TParams>>;
}

// params
export interface ParamsKeys<
  TBase extends string,
  TList extends TKey = never,
  TDetail extends TKey = never,
  TAction extends TKey = never,
  TParams = unknown
> extends Array<TBase | TList | TDetail | TAction | TParams> {}
