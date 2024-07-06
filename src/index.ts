type BaseItem<T extends string> = T | string;

interface QueryArrayBase<TBase extends string, TParams = unknown>
  extends Array<BaseItem<TBase> | TParams> {
  all: () => Readonly<QueryAllArray<TBase>>;

  lists: () => Readonly<QueryListArray<TBase>>;
  list: (key: string) => Readonly<QueryListArray<TBase>>;

  details: () => Readonly<QueryDetailArray<TBase>>;
  detail: (key: string) => Readonly<QueryDetailArray<TBase>>;

  actions: () => Readonly<QueryActionArray<TBase>>;
  action: (action: string) => Readonly<QueryActionArray<TBase>>;

  params: (params: TParams) => Readonly<QueryParamsArray<TBase, TParams>>;
}

type QueryAllArray<T extends string, TParams = unknown> = QueryArrayBase<
  BaseItem<T>,
  TParams
> &
  Array<unknown>;

type QueryListArray<T extends string, TParams = unknown> = Pick<
  QueryAllArray<T, TParams>,
  "details" | "detail" | "params" | "actions" | "action"
> &
  Array<unknown>;

type QueryDetailArray<T extends string, TParams = unknown> = Pick<
  QueryAllArray<T, TParams>,
  "params" | "action" | "actions"
> &
  Array<unknown>;

type QueryActionArray<T extends string, TParams = unknown> = Pick<
  QueryAllArray<T, TParams>,
  "params"
> &
  Array<unknown>;

type QueryParamsArray<TBase extends string, TParams> = QueryAllArray<
  TBase,
  TParams
> &
  Array<unknown>;

// key list
const allKeywords = [
  "all",
  "lists",
  "list",
  "details",
  "detail",
  "actions",
  "action",
  "params",
];
const listKeywords = ["details", "detail", "actions", "action", "params"];
const detailKeywords = ["actions", "action", "params"];
const actionKeywords = ["params"];

const handlerLevelFirst = {
  get<TBase extends string, TParams = unknown>(
    target: Readonly<Array<unknown>>,
    prop: unknown,
    receiver: Readonly<QueryArrayBase<TBase, TParams>>
  ) {
    if (prop === "all") {
      return function () {
        return [...receiver, "all"] as Readonly<QueryAllArray<TBase>>;
      };
    }

    if (prop === "lists") {
      return function () {
        return new Proxy([...receiver.all(), "list"], handlerLevelList);
      };
    }

    if (prop === "list") {
      return function (key: string) {
        return new Proxy([...receiver.lists(), key], handlerLevelList);
      };
    }

    if (prop === "details") {
      return function () {
        return new Proxy([...receiver.all(), "detail"], handlerLevelDetail);
      };
    }

    if (prop === "detail") {
      return function (key: string) {
        return new Proxy([...receiver.details(), key], handlerLevelDetail);
      };
    }

    if (prop === "actions") {
      return function () {
        return new Proxy([...receiver.all(), "action"], handlerLevelAction);
      };
    }

    if (prop === "action") {
      return function (action: string) {
        return new Proxy([...receiver.actions(), action], handlerLevelAction);
      };
    }

    if (prop === "params") {
      return function (params: unknown) {
        return [...receiver, params] as Readonly<
          QueryParamsArray<TBase, TParams>
        >;
      };
    }

    return Reflect.get(target, prop as PropertyKey, receiver);
  },
  has(target: Readonly<Array<unknown>>, prop: unknown) {
    if (typeof prop === "string") {
      if (allKeywords.includes(prop)) {
        return true;
      }
    }

    return Reflect.has(target, prop as PropertyKey);
  },
};

const handlerLevelList = {
  get<TBase extends string, TParams = unknown>(
    target: Readonly<Array<unknown>>,
    prop: unknown,
    receiver: Readonly<QueryListArray<TBase, TParams>>
  ) {
    if (prop === "details") {
      return function () {
        return new Proxy([...receiver, "detail"], handlerLevelDetail);
      };
    }

    if (prop === "detail") {
      return function (key: string) {
        return new Proxy([...receiver.details(), key], handlerLevelDetail);
      };
    }

    if (prop === "actions") {
      return function () {
        return new Proxy([...receiver, "action"], handlerLevelAction);
      };
    }

    if (prop === "action") {
      return function (action: string) {
        return new Proxy([...receiver.actions(), action], handlerLevelAction);
      };
    }

    if (prop === "params") {
      return function (params: unknown) {
        return [...receiver, params] as Readonly<
          QueryParamsArray<TBase, TParams>
        >;
      };
    }

    return Reflect.get(target, prop as PropertyKey, receiver);
  },
  has(target: Readonly<Array<unknown>>, prop: unknown) {
    if (typeof prop === "string") {
      if (listKeywords.includes(prop)) {
        return true;
      }
    }

    return Reflect.has(target, prop as PropertyKey);
  },
};

const handlerLevelDetail = {
  get<TBase extends string, TParams = unknown>(
    target: Readonly<Array<unknown>>,
    prop: unknown,
    receiver: Readonly<QueryDetailArray<TBase, TParams>>
  ) {
    if (prop === "actions") {
      return function () {
        return new Proxy([...receiver, "action"], handlerLevelAction);
      };
    }

    if (prop === "action") {
      return function (action: string) {
        return new Proxy([...receiver.actions(), action], handlerLevelAction);
      };
    }

    if (prop === "params") {
      return function (params: unknown) {
        return [...receiver, params] as Readonly<
          QueryParamsArray<TBase, TParams>
        >;
      };
    }

    return Reflect.get(target, prop as PropertyKey, receiver);
  },
  has(target: Readonly<Array<unknown>>, prop: unknown) {
    if (typeof prop === "string") {
      if (detailKeywords.includes(prop)) {
        return true;
      }
    }

    return Reflect.has(target, prop as PropertyKey);
  },
};

const handlerLevelAction = {
  get<TBase extends string, TParams = unknown>(
    target: Readonly<Array<unknown>>,
    prop: unknown,
    receiver: Readonly<QueryArrayBase<TBase, TParams>>
  ) {
    if (prop === "params") {
      return function (params: unknown) {
        return [...receiver, params] as Readonly<
          QueryParamsArray<TBase, TParams>
        >;
      };
    }

    return Reflect.get(target, prop as PropertyKey, receiver);
  },
  has(target: Readonly<Array<unknown>>, prop: unknown) {
    if (typeof prop === "string") {
      if (actionKeywords.includes(prop)) {
        return true;
      }
    }

    return Reflect.has(target, prop as PropertyKey);
  },
};

export const createQueryFactory = <TBase extends string, TParams = unknown>(
  baseQuery: TBase
) =>
  new Proxy(
    [baseQuery] as unknown as QueryArrayBase<TBase, TParams>,
    handlerLevelFirst
  ) as QueryArrayBase<TBase, TParams>;

export const queryChain = createQueryFactory;
