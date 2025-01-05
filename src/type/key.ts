// key level
// with 10 length randomly generated string.
export const additions = {
  ALL: ['Cl-vDIC-ej', '_all'],
  LIST: ['Mdnu7ZWZJe', '_list'],
  ITEM: ['cYbaPq1lEo', '_item'],
  ACTION: ['5DK1CUCADG', '_action'],
  PARAMS: ['SbOhtjkYSG', '_params'],
} as const;

// key list
export const actionParams = ['params'] as const;
export const itemParams = ['actions', 'action', ...actionParams] as const;
export const listParams = ['items', 'item', ...itemParams] as const;
export const allParams = ['all', 'lists', 'list', ...listParams] as const;

export type AllParams = (typeof allParams)[number];
export type ListParams = (typeof listParams)[number];
export type ItemParams = (typeof itemParams)[number];
export type ActionParams = (typeof actionParams)[number];
