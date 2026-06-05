import {expect, test, vi} from 'vitest';

import {chain, createChainFactory} from '.';
import {additions} from './type/key';

test('key factory error test', () => {
  const factory = createChainFactory(['valid_key', 'valid_key2', 'valid_key3'], {
    severity: 'error',
  });

  // @ts-expect-error intentional error
  expect(() => factory('invalid_key')).toThrow();
});

test('key factory warning and silent modes', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

  const consoleFactory = createChainFactory(['valid_key'], {
    severity: 'console',
  });
  const silentFactory = createChainFactory(['valid_key'], {
    severity: 'silent',
  });

  // @ts-expect-error intentional error
  expect(consoleFactory('invalid_key').all()).toEqual(['invalid_key', ...additions.ALL]);
  expect(warn).toHaveBeenCalledOnce();

  // @ts-expect-error intentional error
  expect(silentFactory('invalid_key').all()).toEqual(['invalid_key', ...additions.ALL]);
  expect(warn).toHaveBeenCalledOnce();

  expect(consoleFactory('valid_key').all()).toEqual(['valid_key', ...additions.ALL]);

  warn.mockRestore();
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

test('chain property checks and params at each level', () => {
  const base = chain('test');
  expect('all' in base).toBe(true);
  expect('missing' in base).toBe(false);
  expect(base.params('base-params')).toEqual(['test', ...additions.PARAMS, 'base-params']);

  const list = base.list('list-test');
  expect('items' in list).toBe(true);
  expect('missing' in list).toBe(false);
  expect(list.params('list-params')).toEqual([
    'test',
    ...additions.ALL,
    ...additions.LIST,
    'list-test',
    ...additions.PARAMS,
    'list-params',
  ]);

  const item = list.item('item-test');
  expect('actions' in item).toBe(true);
  expect('missing' in item).toBe(false);
  expect(item.params('item-params')).toEqual([
    'test',
    ...additions.ALL,
    ...additions.LIST,
    'list-test',
    ...additions.ITEM,
    'item-test',
    ...additions.PARAMS,
    'item-params',
  ]);

  const final = item.action('action-test');
  expect('params' in final).toBe(true);
  expect('missing' in final).toBe(false);
  expect(final.params('final-params')).toEqual([
    'test',
    ...additions.ALL,
    ...additions.LIST,
    'list-test',
    ...additions.ITEM,
    'item-test',
    ...additions.ACTION,
    'action-test',
    ...additions.PARAMS,
    'final-params',
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
