import type {ActionParams, ItemParams, ListParams} from './key.js';

export interface Chain<TKey extends string> extends ReadonlyArray<unknown> {
  all: () => [TKey, ...unknown[]];

  lists: () => FChain<TKey>;
  items: () => FChain<TKey>;
  actions: () => FChain<TKey>;

  list: (key: unknown) => LChain<TKey>;
  item: (key: unknown) => IChain<TKey>;
  action: (key: unknown) => FChain<TKey>;

  params: (params: unknown) => [TKey, ...unknown[]];
}

// params type
export type LChain<TKey extends string> = Pick<Chain<TKey>, ListParams> & ReadonlyArray<unknown>;
export type IChain<TKey extends string> = Pick<Chain<TKey>, ItemParams> & ReadonlyArray<unknown>;
export type FChain<TKey extends string> = Pick<Chain<TKey>, ActionParams> & ReadonlyArray<unknown>;
