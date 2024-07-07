import {
  BaseQuery,
  QueryActionArray,
  QueryAllArray,
  QueryDetailArray,
  QueryListArray,
  QueryParamsArray,
} from "./type/array";
import { TKey } from "./type/key";

// key list
const actionKeywords = ["params"];
const detailKeywords = ["actions", "action", ...actionKeywords];
const listKeywords = ["details", "detail", ...detailKeywords];
const allKeywords = ["all", "lists", "list", ...listKeywords];

const handlerLevelBase = {
  get<TBase extends string, TListKeyValue extends TKey>(
    target: Readonly<Array<unknown>>,
    prop: unknown,
    receiver: Readonly<BaseQuery<TBase>>
  ) {
    if (prop === "all") {
      return function () {
        return [...receiver, "all"] as Readonly<QueryAllArray<TBase>>;
      };
    }

    if (prop === "lists") {
      return function () {
        return new Proxy(
          [...receiver.all(), "list"],
          handlerLevelList
        ) as Readonly<QueryListArray<TBase, never>>;
      };
    }

    if (prop === "list") {
      return function (key: TListKeyValue) {
        return new Proxy(
          [...receiver.lists(), key],
          handlerLevelList
        ) as Readonly<QueryListArray<TBase, TListKeyValue>>;
      };
    }

    if (prop === "details") {
      return function () {
        return new Proxy([...receiver.all(), "detail"], handlerLevelDetail);
      };
    }

    if (prop === "detail") {
      return function (key: TListKeyValue) {
        return new Proxy([...receiver.details(), key], handlerLevelDetail);
      };
    }

    if (prop === "actions") {
      return function () {
        return new Proxy([...receiver.all(), "action"], handlerLevelAction);
      };
    }

    if (prop === "action") {
      return function (action: TListKeyValue) {
        return new Proxy([...receiver.actions(), action], handlerLevelAction);
      };
    }

    if (prop === "params") {
      return function <TParams = unknown>(params: TParams) {
        return [...receiver, params] as Readonly<
          QueryParamsArray<TBase, never, never, never, TParams>
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
  get<TBase extends string, TListKeyValue extends TKey>(
    target: Readonly<Array<unknown>>,
    prop: unknown,
    receiver: Readonly<QueryListArray<TBase, TListKeyValue>>
  ) {
    if (prop === "details") {
      return function () {
        return new Proxy([...receiver, "detail"], handlerLevelDetail);
      };
    }

    if (prop === "detail") {
      return function (key: TListKeyValue) {
        return new Proxy([...receiver.details(), key], handlerLevelDetail);
      };
    }

    if (prop === "actions") {
      return function () {
        return new Proxy([...receiver, "action"], handlerLevelAction);
      };
    }

    if (prop === "action") {
      return function (action: TListKeyValue) {
        return new Proxy([...receiver.actions(), action], handlerLevelAction);
      };
    }

    if (prop === "params") {
      return function <TParams = unknown>(params: TParams) {
        return [...receiver, params] as Readonly<
          QueryParamsArray<TBase, TListKeyValue, never, never, TParams>
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
  get<TBase extends string, TKeyValue extends TKey>(
    target: Readonly<Array<unknown>>,
    prop: unknown,
    receiver: Readonly<QueryDetailArray<TBase, TKeyValue, never>>
  ) {
    if (prop === "actions") {
      return function () {
        return new Proxy([...receiver, "action"], handlerLevelAction);
      };
    }

    if (prop === "action") {
      return function (action: TKeyValue) {
        return new Proxy([...receiver.actions(), action], handlerLevelAction);
      };
    }

    if (prop === "params") {
      return function <TParams = unknown>(params: TParams) {
        return [...receiver, params] as Readonly<
          QueryParamsArray<TBase, TKeyValue, never, never, TParams>
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
  get<TBase extends string, TKeyValue extends TKey>(
    target: Readonly<Array<unknown>>,
    prop: unknown,
    receiver: Readonly<QueryActionArray<TBase, TKeyValue, never, never>>
  ) {
    if (prop === "params") {
      return function <TParams = unknown>(params: TParams) {
        return [...receiver, params] as Readonly<
          QueryParamsArray<TBase, TKeyValue, never, never, TParams>
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

export const createQueryFactory = <TBase extends string>(baseQuery: TBase) =>
  new Proxy([baseQuery], handlerLevelBase) as Readonly<BaseQuery<TBase>>;

export const queryChain = createQueryFactory;
