import { BaseKey, ActionKeys, DetailKeys, ListKeys } from "./type/array";
import { TKey } from "./type/key";

// key list
const actionKeywords = ["params"];
const detailKeywords = ["actions", "action", ...actionKeywords];
const listKeywords = ["details", "detail", ...detailKeywords];
const allKeywords = ["all", "lists", "list", ...listKeywords];

const handlerLevelBase = {
  get<TBase extends string, TListKeyValue extends TKey>(
    target: ReadonlyArray<unknown>,
    prop: unknown,
    receiver: BaseKey<TBase>
  ) {
    if (prop === "all") {
      return function () {
        return [...receiver, "all"];
      };
    }

    if (prop === "lists") {
      return function () {
        return new Proxy(
          [...receiver.all(), "#list"],
          handlerLevelList
        ) as ListKeys<TBase, never>;
      };
    }

    if (prop === "list") {
      return function (key: TListKeyValue) {
        return new Proxy(
          [...receiver.lists(), key],
          handlerLevelList
        ) as ListKeys<TBase, TListKeyValue>;
      };
    }

    if (prop === "details") {
      return function () {
        return new Proxy([...receiver.all(), "#detail"], handlerLevelDetail);
      };
    }

    if (prop === "detail") {
      return function (key: TListKeyValue) {
        return new Proxy([...receiver.details(), key], handlerLevelDetail);
      };
    }

    if (prop === "actions") {
      return function () {
        return new Proxy([...receiver.all(), "#action"], handlerLevelAction);
      };
    }

    if (prop === "action") {
      return function (action: TListKeyValue) {
        return new Proxy([...receiver.actions(), action], handlerLevelAction);
      };
    }

    if (prop === "params") {
      return function <TParams = unknown>(params: TParams) {
        return [...receiver, params];
      };
    }

    return Reflect.get(target, prop as PropertyKey, receiver);
  },
  has(target: ReadonlyArray<unknown>, prop: unknown) {
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
    target: ReadonlyArray<unknown>,
    prop: unknown,
    receiver: ListKeys<TBase, TListKeyValue>
  ) {
    if (prop === "details") {
      return function () {
        return new Proxy([...receiver, "#detail"], handlerLevelDetail);
      };
    }

    if (prop === "detail") {
      return function (key: TListKeyValue) {
        return new Proxy([...receiver.details(), key], handlerLevelDetail);
      };
    }

    if (prop === "actions") {
      return function () {
        return new Proxy([...receiver, "#action"], handlerLevelAction);
      };
    }

    if (prop === "action") {
      return function (action: TListKeyValue) {
        return new Proxy([...receiver.actions(), action], handlerLevelAction);
      };
    }

    if (prop === "params") {
      return function <TParams = unknown>(params: TParams) {
        return [...receiver, params];
      };
    }

    return Reflect.get(target, prop as PropertyKey, receiver);
  },
  has(target: Readonly<ReadonlyArray<unknown>>, prop: unknown) {
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
    target: ReadonlyArray<unknown>,
    prop: unknown,
    receiver: DetailKeys<TBase, TKeyValue, never>
  ) {
    if (prop === "actions") {
      return function () {
        return new Proxy([...receiver, "#action"], handlerLevelAction);
      };
    }

    if (prop === "action") {
      return function (action: TKeyValue) {
        return new Proxy([...receiver.actions(), action], handlerLevelAction);
      };
    }

    if (prop === "params") {
      return function <TParams = unknown>(params: TParams) {
        return [...receiver, params];
      };
    }

    return Reflect.get(target, prop as PropertyKey, receiver);
  },
  has(target: ReadonlyArray<unknown>, prop: unknown) {
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
    target: ReadonlyArray<unknown>,
    prop: unknown,
    receiver: ActionKeys<TBase, TKeyValue, never, never>
  ) {
    if (prop === "params") {
      return function <TParams = unknown>(params: TParams) {
        return [...receiver, params];
      };
    }

    return Reflect.get(target, prop as PropertyKey, receiver);
  },
  has(target: ReadonlyArray<unknown>, prop: unknown) {
    if (typeof prop === "string") {
      if (actionKeywords.includes(prop)) {
        return true;
      }
    }

    return Reflect.has(target, prop as PropertyKey);
  },
};

/**
 * @param keys base keys.
 * @returns `createQueryKey` function with typed base keys.
 * @example
 * ```ts
 * const chain = createQueryKeyFactory("dashboard", "user", "account")
 * chain("dashboard").all()
 * ```
 */
export const createQueryKeyFactory = <TBaseArray extends Array<string>>(
  ...keys: TBaseArray
) => {
  return <T extends (typeof keys)[number]>(baseQuery: T) =>
    new Proxy([baseQuery], handlerLevelBase) as BaseKey<T>;
};

/**
 * @param baseKey base key string.
 * @returns [baseQuery]
 * @example
 * ```ts
 * const query = createQueryKey("dashboard")
 * ```
 */
export const createQueryKey = <TBase extends string>(baseKey: TBase) =>
  new Proxy([baseKey], handlerLevelBase) as BaseKey<TBase>;

/**
 * @description same with `createQueryKey` with shorter name.
 * @param baseKey base key string.
 * @returns [baseKey]
 * @example
 * ```ts
 * const query = keyChain("dashboard")
 * ```
 */
export const keyChain = createQueryKey;
