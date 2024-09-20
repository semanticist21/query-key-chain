import {ActionParams, DetailParams, ListParams} from './key';

export interface Chain<TKey extends string> extends ReadonlyArray<unknown> {
  all: () => [TKey, ...unknown[]];

  lists: () => [TKey, ...unknown[]];
  details: () => [TKey, ...unknown[]];
  actions: () => [TKey, ...unknown[]];

  list: (key: unknown) => LChain<TKey>;
  detail: (key: unknown) => DChain<TKey>;
  action: (key: unknown) => AChain<TKey>;

  params: (params: unknown) => [TKey, ...unknown[]];
}

// params type
export type LChain<TKey extends string> = Pick<Chain<TKey>, ListParams> & ReadonlyArray<unknown>;
export type DChain<TKey extends string> = Pick<Chain<TKey>, DetailParams> & ReadonlyArray<unknown>;
export type AChain<TKey extends string> = Pick<Chain<TKey>, ActionParams> & ReadonlyArray<unknown>;
