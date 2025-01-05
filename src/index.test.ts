import {expect, test} from 'vitest';

import {chain, createChainFactory} from '.';
import {additions} from './type/key';

test('key factory error test', () => {
  const factory = createChainFactory(['valid_key'], {
    severity: 'error',
  });

  // @ts-expect-error intentional error
  expect(() => factory('invalid_key')).toThrow();
});

test('key generation test - 1 depth', () => {
  expect(chain('test').all()).toEqual(['test', ...additions.ALL]);
  expect(chain('test').lists()).toEqual(['test', ...additions.ALL, ...additions.LIST]);
  expect(chain('test').items()).toEqual(['test', ...additions.ALL, ...additions.ITEM]);
  expect(chain('test').actions()).toEqual(['test', ...additions.ALL, ...additions.ACTION]);
});

test('key generation test - 2 depth', () => {
  expect(chain('test').lists().params({params: 'params-test'})).toEqual([
    'test',
    ...additions.ALL,
    ...additions.LIST,
    ...additions.PARAMS,
    {params: 'params-test'},
  ]);

  expect(chain('test').list('list-test').item('item-test')).toEqual([
    'test',
    ...additions.ALL,
    ...additions.LIST,
    'list-test',
    ...additions.ITEM,
    'item-test',
  ]);

  expect(chain('test').item('item-test').action('action-test')).toEqual([
    'test',
    ...additions.ALL,
    ...additions.ITEM,
    'item-test',
    ...additions.ACTION,
    'action-test',
  ]);

  expect(chain('test').action('action-test').params({params: 'params-test'})).toEqual([
    'test',
    ...additions.ALL,
    ...additions.ACTION,
    'action-test',
    ...additions.PARAMS,
    {params: 'params-test'},
  ]);
});

test('hierarchy test', () => {
  const ancestor = chain('test');
  const child = ancestor.list('list-test').item('item-test').action('action-test').params({
    page: 1,
    limit: 10,
  });

  const lists = ancestor.lists();
  const sliced = child.slice(0, 5);

  expect(lists).toEqual(sliced);

  const items = ancestor.list('list-test').items();
  const slicedItems = child.slice(0, 8);

  expect(items).toEqual(slicedItems);

  const actions = ancestor.list('list-test').item('item-test').actions();
  const slicedActions = child.slice(0, 11);

  expect(actions).toEqual(slicedActions);
});

test('key generation test - group', () => {
  expect(chain('test').lists()).toEqual(['test', ...additions.ALL, ...additions.LIST]);

  expect(chain('test').list('list-test').items()).toEqual([
    'test',
    ...additions.ALL,
    ...additions.LIST,
    'list-test',
    ...additions.ITEM,
  ]);

  expect(chain('test').list('list-test').item('item-test').actions()).toEqual([
    'test',
    ...additions.ALL,
    ...additions.LIST,
    'list-test',
    ...additions.ITEM,
    'item-test',
    ...additions.ACTION,
  ]);
});

test('performance test', () => {
  const start = performance.now();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _i of Array.from({length: 5000})) {
    chain('test').list('list-test').item('item-test').action('action-test').params({
      page: 1,
      limit: 10,
    });
  }

  const end = performance.now();
  const duration = end - start;

  const limitMs = 100;

  expect(duration).toBeLessThan(limitMs);
});
