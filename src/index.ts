import {z} from 'zod';
import type {Chain, FChain, IChain, LChain} from './type/array';
import {
  type ActionParams,
  type AllParams,
  type ItemParams,
  type ListParams,
  actionParams,
  additions,
  allParams,
  itemParams,
  listParams,
} from './type/key';

const handleBase = {
  get<TKey extends string>(target: unknown[], prop: unknown, receiver: Chain<TKey>) {
    switch (prop) {
      case 'all':
        return () => [...receiver, ...additions.ALL];

      case 'lists':
        return () => new Proxy([...receiver.all(), ...additions.LIST], handleFinal);
      case 'items':
        return () => new Proxy([...receiver.all(), ...additions.ITEM], handleFinal);
      case 'actions':
        return () => new Proxy([...receiver.all(), ...additions.ACTION], handleFinal);

      case 'list':
        return (key: unknown) => new Proxy([...receiver.all(), ...additions.LIST, key], handleList);
      case 'item':
        return (key: unknown) => new Proxy([...receiver.all(), ...additions.ITEM, key], handleItem);
      case 'action':
        return (key: unknown) => new Proxy([...receiver.all(), ...additions.ACTION, key], handleFinal);

      case 'params':
        return (params: unknown) => [...receiver, ...additions.PARAMS, params];

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
      case 'items':
        return () => new Proxy([...receiver, ...additions.ITEM], handleFinal);
      case 'actions':
        return () => new Proxy([...receiver, ...additions.ACTION], handleFinal);

      case 'item':
        return (key: unknown) => new Proxy([...receiver, ...additions.ITEM, key], handleItem);
      case 'action':
        return (key: unknown) => new Proxy([...receiver, ...additions.ACTION, key], handleFinal);

      case 'params':
        return (params: unknown) => [...receiver, ...additions.PARAMS, params];

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

const handleItem = {
  get<TKey extends string>(target: unknown[], prop: unknown, receiver: IChain<TKey>) {
    switch (prop) {
      case 'actions':
        return () => new Proxy([...receiver, ...additions.ACTION], handleFinal);

      case 'action':
        return (action: unknown) => new Proxy([...receiver, ...additions.ACTION, action], handleFinal);

      case 'params':
        return (params: unknown) => [...receiver, ...additions.PARAMS, params];

      default:
        return Reflect.get(target, prop as PropertyKey, receiver);
    }
  },

  has(target: unknown[], prop: unknown) {
    if (typeof prop === 'string' && itemParams.includes(prop as ItemParams)) {
      return true;
    }

    return Reflect.has(target, prop as PropertyKey);
  },
};

const handleFinal = {
  get<TKey extends string>(target: unknown[], prop: unknown, receiver: FChain<TKey>) {
    switch (prop) {
      case 'params':
        return (params: unknown) => [...receiver, ...additions.PARAMS, params];
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
 * @returns `chain` function with validation.
 *
 * @param {U[]} keys
 *
 * @example
 * ```ts
 * const chain = createChainFactory(["dashboard", "user", "account"])
 * chain("dashboard").all()
 * chain("invalid_key").all() // throw error
 * ```
 */
export const createChainFactory = <U extends string, TBases extends [U, ...U[]]>(
  keys: TBases,
  options?: {
    /** @default 'console' */
    severity?: 'error' | 'console' | 'silent';
  }
) => {
  const schema = z.enum(keys);

  return <T extends z.infer<typeof schema>>(baseQuery: T) => {
    if (options?.severity !== 'silent') {
      const msg = `Invalid query key "${baseQuery}" detected. It must be one of the following: ${keys.map((key) => `"${key}"`).join(', ')}.`;

      if (!schema.safeParse(baseQuery).success) {
        if (options?.severity === 'error') {
          throw new Error(msg);
        }

        if (!options || !options.severity || options?.severity === 'console') {
          console.warn(msg);
        }
      }
    }

    return new Proxy([baseQuery], handleBase) as unknown as Chain<T>;
  };
};

/**
 * @param baseKey base key string.
 * @returns [baseKey] with chainable methods.
 * @example
 * ```ts
 * const query = chain("dashboard")
 * ```
 */
export const chain = <TBase extends string>(baseKey: TBase) => new Proxy([baseKey], handleBase) as unknown as Chain<TBase>;
