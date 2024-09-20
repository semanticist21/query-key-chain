import {expect, test} from 'vitest';

import {createQueryKey} from '.';
import {ADDITIONS} from './type/key';

test('key generation test - 1 depth', () => {
  expect(createQueryKey('test').all()).toEqual(['test', ...ADDITIONS.all]);
  expect(createQueryKey('test').lists()).toEqual(['test', ...ADDITIONS.all, ...ADDITIONS.list]);
  expect(createQueryKey('test').details()).toEqual(['test', ...ADDITIONS.all, ...ADDITIONS.detail]);
  expect(createQueryKey('test').actions()).toEqual(['test', ...ADDITIONS.all, ...ADDITIONS.action]);
});

test('key generation test - 2 depth', () => {
  expect(createQueryKey('test').list('list-test').detail('detail-test')).toEqual([
    'test',
    ...ADDITIONS.all,
    ...ADDITIONS.list,
    'list-test',
    ...ADDITIONS.detail,
    'detail-test',
  ]);

  expect(createQueryKey('test').detail('detail-test').action('action-test')).toEqual([
    'test',
    ...ADDITIONS.all,
    ...ADDITIONS.detail,
    'detail-test',
    ...ADDITIONS.action,
    'action-test',
  ]);

  expect(createQueryKey('test').action('action-test').params({params: 'params-test'})).toEqual([
    'test',
    ...ADDITIONS.all,
    ...ADDITIONS.action,
    'action-test',
    ...ADDITIONS.params,
    {params: 'params-test'},
  ]);
});

test('hierarchy test', () => {
  const ancestor = createQueryKey('test');
  const child = ancestor.list('list-test').detail('detail-test').action('action-test').params({
    page: 1,
    limit: 10,
  });

  const lists = ancestor.lists();
  const sliced = child.slice(0, 5);

  expect(lists).toEqual(sliced);

  const details = ancestor.list('list-test').details();
  const slicedDetails = child.slice(0, 8);

  expect(details).toEqual(slicedDetails);

  const actions = ancestor.list('list-test').detail('detail-test').actions();
  const slicedActions = child.slice(0, 11);

  expect(actions).toEqual(slicedActions);
});

test('key generation test - group', () => {
  expect(createQueryKey('test').lists()).toEqual(['test', ...ADDITIONS.all, ...ADDITIONS.list]);

  expect(createQueryKey('test').list('list-test').details()).toEqual([
    'test',
    ...ADDITIONS.all,
    ...ADDITIONS.list,
    'list-test',
    ...ADDITIONS.detail,
  ]);

  expect(createQueryKey('test').detail('detail-test').actions()).toEqual([
    'test',
    ...ADDITIONS.all,
    ...ADDITIONS.detail,
    'detail-test',
    ...ADDITIONS.action,
  ]);
});

test('performance test', () => {
  const start = performance.now();

  const chain = createQueryKey('test');

  Array.from({length: 5000}).forEach(() => {
    chain.list('list-test').detail('detail-test').action('action-test').params({
      page: 1,
      limit: 10,
    });
  });

  const end = performance.now();
  const duration = end - start;

  const limitMs = 100;

  expect(duration).toBeLessThan(limitMs);
});
