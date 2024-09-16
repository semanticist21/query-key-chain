import { BaseKey, ActionKeys, DetailKeys, ListKeys } from "./type/array";
import {
  actionsObjectKeys,
  allObjectKeys,
  detailObjectKeys,
  KEY_ATTACH,
  listObjectKeys,
  TKey,
} from "./type/key";

const handlerLevelBase = {
  get<TBase extends string, TListKeyValue extends TKey>(
    target: ReadonlyArray<unknown>,
    prop: unknown,
    receiver: BaseKey<TBase>
  ) {
    switch (prop) {
      case "all":
        return () => {
          return [...receiver, KEY_ATTACH.all];
        };

      case "lists":
        return () => {
          return [...receiver.all(), KEY_ATTACH.list];
        };

      case "list":
        return (key: TListKeyValue) => {
          return new Proxy([...receiver.lists(), key], handlerLevelList);
        };

      case "details":
        return () => {
          return [...receiver.all(), KEY_ATTACH.detail];
        };

      case "detail":
        return (key: TListKeyValue) => {
          return new Proxy([...receiver.details(), key], handlerLevelDetail);
        };

      case "actions":
        return () => {
          return [...receiver.all(), KEY_ATTACH.action];
        };

      case "action":
        return (action: TListKeyValue) => {
          return new Proxy([...receiver.actions(), action], handlerLevelAction);
        };

      case "params":
        return <TParams = unknown>(params: TParams) => {
          return [...receiver, KEY_ATTACH.params, params];
        };

      default:
        return Reflect.get(target, prop as PropertyKey, receiver);
    }
  },
  has(target: ReadonlyArray<unknown>, prop: unknown) {
    if (typeof prop === "string") {
      if (allObjectKeys.includes(prop)) {
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
    switch (prop) {
      case "details":
        return () => {
          return [...receiver, KEY_ATTACH.detail];
        };

      case "detail":
        return (key: TListKeyValue) => {
          return new Proxy([...receiver.details(), key], handlerLevelDetail);
        };

      case "actions":
        return () => {
          return [...receiver, KEY_ATTACH.action];
        };

      case "action":
        return (action: TListKeyValue) => {
          return new Proxy([...receiver.actions(), action], handlerLevelAction);
        };

      case "params":
        return <TParams = unknown>(params: TParams) => {
          return [...receiver, KEY_ATTACH.params, params];
        };

      default:
        return Reflect.get(target, prop as PropertyKey, receiver);
    }
  },
  has(target: Readonly<ReadonlyArray<unknown>>, prop: unknown) {
    if (typeof prop === "string") {
      if (listObjectKeys.includes(prop)) {
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
    switch (prop) {
      case "actions":
        return () => {
          return [...receiver, KEY_ATTACH.action];
        };

      case "action":
        return (action: TKeyValue) => {
          return new Proxy([...receiver.actions(), action], handlerLevelAction);
        };

      case "params":
        return <TParams = unknown>(params: TParams) => {
          return [...receiver, KEY_ATTACH.params, params];
        };

      default:
        return Reflect.get(target, prop as PropertyKey, receiver);
    }
  },
  has(target: ReadonlyArray<unknown>, prop: unknown) {
    if (typeof prop === "string") {
      if (detailObjectKeys.includes(prop)) {
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
        return [...receiver, KEY_ATTACH.params, params];
      };
    }

    return Reflect.get(target, prop as PropertyKey, receiver);
  },
  has(target: ReadonlyArray<unknown>, prop: unknown) {
    if (typeof prop === "string") {
      if (actionsObjectKeys.includes(prop)) {
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
