type TKey = string | number | symbol | boolean | bigint;

interface QueryArrayBase<
  TBase extends string,
  TKeyValue extends TKey,
  TParams = unknown
> extends Array<TBase | TKeyValue | TParams> {
  all: () => Readonly<QueryAllArray<TBase, TKeyValue>>;

  lists: () => Readonly<QueryListArray<TBase, TKeyValue>>;
  list: (key: TKey) => Readonly<QueryListArray<TBase, TKeyValue>>;

  details: () => Readonly<QueryDetailArray<TBase, TKeyValue>>;
  detail: (key: TKey) => Readonly<QueryDetailArray<TBase, TKeyValue>>;

  actions: () => Readonly<QueryActionArray<TBase, TKeyValue>>;
  action: (action: TKey) => Readonly<QueryActionArray<TBase, TKeyValue>>;

  params: (
    params: TParams
  ) => Readonly<QueryParamsArray<TBase, TKeyValue, TParams>>;
}

type QueryAllArray<
  TBase extends string,
  TKeyValue extends TKey
> = QueryArrayBase<TBase, TKeyValue> & Array<unknown>;

type QueryListArray<TBase extends string, TKeyValue extends TKey> = Pick<
  QueryAllArray<TBase, TKeyValue>,
  "details" | "detail" | "params" | "actions" | "action"
> &
  Array<unknown>;

type QueryDetailArray<TBase extends string, TKeyValue extends TKey> = Pick<
  QueryAllArray<TBase, TKeyValue>,
  "params" | "action" | "actions"
> &
  Array<unknown>;

type QueryActionArray<TBase extends string, TKeyValue extends TKey> = Pick<
  QueryAllArray<TBase, TKeyValue>,
  "params"
> &
  Array<unknown>;

type QueryParamsArray<
  TBase extends string,
  TKeyValue extends TKey,
  TParams = unknown
> = QueryAllArray<TBase, TKeyValue> & Array<TBase | TKeyValue | TParams>;

// key list
const actionKeywords = ["params"];
const detailKeywords = ["actions", "action", ...actionKeywords];
const listKeywords = ["details", "detail", ...detailKeywords];
const allKeywords = ["all", "lists", "list", ...listKeywords];

const handlerLevelFirst = {
  get<TBase extends string, TKeyValue extends TKey, TParams = unknown>(
    target: Readonly<Array<unknown>>,
    prop: unknown,
    receiver: Readonly<QueryArrayBase<TBase, TKeyValue>>
  ) {
    if (prop === "all") {
      return function () {
        return [...receiver, "all"] as Readonly<
          QueryAllArray<TBase, TKeyValue>
        >;
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
          QueryParamsArray<TBase, TKeyValue, TParams>
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
  get<TBase extends string, TKeyValue extends TKey, TParams = unknown>(
    target: Readonly<Array<unknown>>,
    prop: unknown,
    receiver: Readonly<QueryListArray<TBase, TKeyValue>>
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
          QueryParamsArray<TBase, TKeyValue, TParams>
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
  get<TBase extends string, TKeyValue extends TKey, TParams = unknown>(
    target: Readonly<Array<unknown>>,
    prop: unknown,
    receiver: Readonly<QueryDetailArray<TBase, TKeyValue>>
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
          QueryParamsArray<TBase, TKeyValue, TParams>
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
  get<TBase extends string, TKeyValue extends TKey, TParams = unknown>(
    target: Readonly<Array<unknown>>,
    prop: unknown,
    receiver: Readonly<QueryArrayBase<TBase, TKeyValue>>
  ) {
    if (prop === "params") {
      return function (params: unknown) {
        return [...receiver, params] as Readonly<
          QueryParamsArray<TBase, TKeyValue, TParams>
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

export const createQueryFactory = <
  TBase extends string,
  TKeyValue extends TKey,
  TParams = unknown
>(
  baseQuery: TBase
) =>
  new Proxy([baseQuery], handlerLevelFirst) as Readonly<
    QueryArrayBase<TBase, TKeyValue, TParams>
  >;

export const queryChain = createQueryFactory;
