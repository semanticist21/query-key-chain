import {AChain, Chain, DChain, LChain} from './type/array';
import {
  ADDITIONS,
  ActionParams,
  AllParams,
  DetailParams,
  ListParams,
  actionParams,
  allParams,
  detailParams,
  listParams,
} from './type/key';

const handleBase = {
  get<TKey extends string>(target: unknown[], prop: unknown, receiver: Chain<TKey>) {
    switch (prop) {
      case 'all':
        return () => [...receiver, ...ADDITIONS.all];

      case 'lists':
        return () => [...receiver.all(), ...ADDITIONS.list];
      case 'details':
        return () => [...receiver.all(), ...ADDITIONS.detail];
      case 'actions':
        return () => [...receiver.all(), ...ADDITIONS.action];

      case 'list':
        return (key: unknown) => new Proxy([...receiver.lists(), key], handleList);
      case 'detail':
        return (key: unknown) => new Proxy([...receiver.details(), key], handleDetail);
      case 'action':
        return (key: unknown) => new Proxy([...receiver.actions(), key], handleAction);

      case 'params':
        return (params: unknown) => [...receiver, ...ADDITIONS.params, params];

      default:
        return Reflect.get(target, prop as PropertyKey, receiver);
    }
  },

  has(target: unknown[], prop: unknown) {
    if (typeof prop === 'string' && allParams.includes(prop as AllParams)) {
      return true;
    }

    return Reflect.has(target, prop as PropertyKey);
  },
};

const handleList = {
  get<TKey extends string>(target: unknown[], prop: unknown, receiver: LChain<TKey>) {
    switch (prop) {
      case 'details':
        return () => [...receiver, ...ADDITIONS.detail];
      case 'actions':
        return () => [...receiver, ...ADDITIONS.action];

      case 'detail':
        return (key: unknown) => new Proxy([...receiver.details(), key], handleDetail);
      case 'action':
        return (key: unknown) => new Proxy([...receiver.actions(), key], handleAction);

      case 'params':
        return (params: unknown) => [...receiver, ...ADDITIONS.params, params];

      default:
        return Reflect.get(target, prop as PropertyKey, receiver);
    }
  },

  has(target: unknown[], prop: unknown) {
    if (typeof prop === 'string' && listParams.includes(prop as ListParams)) {
      return true;
    }

    return Reflect.has(target, prop as PropertyKey);
  },
};

const handleDetail = {
  get<TKey extends string>(target: unknown[], prop: unknown, receiver: DChain<TKey>) {
    switch (prop) {
      case 'actions':
        return () => [...receiver, ...ADDITIONS.action];

      case 'action':
        return (action: unknown) => new Proxy([...receiver.actions(), action], handleAction);

      case 'params':
        return (params: unknown) => [...receiver, ...ADDITIONS.params, params];

      default:
        return Reflect.get(target, prop as PropertyKey, receiver);
    }
  },

  has(target: unknown[], prop: unknown) {
    if (typeof prop === 'string' && detailParams.includes(prop as DetailParams)) {
      return true;
    }

    return Reflect.has(target, prop as PropertyKey);
  },
};

const handleAction = {
  get<TKey extends string>(target: unknown[], prop: unknown, receiver: AChain<TKey>) {
    switch (prop) {
      case 'params':
        return (params: unknown) => [...receiver, ...ADDITIONS.params, params];
    }

    return Reflect.get(target, prop as PropertyKey, receiver);
  },

  has(target: unknown[], prop: unknown) {
    if (typeof prop === 'string' && actionParams.includes(prop as ActionParams)) {
      return true;
    }

    return Reflect.has(target, prop as PropertyKey);
  },
};

/**
 * @param keys base keys.
 * @returns `createQueryKey` function with typed base keys.
 * @example
 * ```ts
 * const keys = ["dashboard", "user", "account"] as const;
 * const chain = createQueryKeyFactory(...keys)
 * chain("dashboard").all()
 * ```
 */
export const createQueryKeyFactory = <TBaseArray extends Array<string>>(...keys: TBaseArray) => {
  return <T extends (typeof keys)[number]>(baseQuery: T) =>
    new Proxy([baseQuery], handleBase) as unknown as Chain<T>;
};

/**
 * @param baseKey base key string.
 * @returns [baseKey] with chainable methods.
 * @example
 * ```ts
 * const query = createQueryKey("dashboard")
 * ```
 */
export const createQueryKey = <TBase extends string>(baseKey: TBase) =>
  new Proxy([baseKey], handleBase) as unknown as Chain<TBase>;

/**
 * @description same with `createQueryKey` with shorter name.
 * @param baseKey base key string.
 * @returns [baseKey] with chainable methods.
 * @example
 * ```ts
 * const query = keyChain("dashboard")
 * ```
 */
export const keyChain = createQueryKey;
