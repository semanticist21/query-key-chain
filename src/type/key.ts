// key level
export const ADDITIONS = {
  all: ['Cl-vDIC-ej', '_all'],
  list: ['Mdnu7ZWZJe', '_list'],
  detail: ['cYbaPq1lEo', '_detail'],
  action: ['5DK1CUCADG', '_action'],
  params: ['SbOhtjkYSG', '_params'],
} as const;

// key list
export const actionParams = ['params'] as const;
export const detailParams = ['actions', 'action', ...actionParams] as const;
export const listParams = ['details', 'detail', ...detailParams] as const;
export const allParams = ['all', 'lists', 'list', ...listParams] as const;

export type AllParams = (typeof allParams)[number];
export type ListParams = (typeof listParams)[number];
export type DetailParams = (typeof detailParams)[number];
export type ActionParams = (typeof actionParams)[number];
