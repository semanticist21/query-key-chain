export const KEY_ATTACH = {
  all: "#all",
  list: "#list",
  detail: "#detail",
  action: "#action",
  params: "#params",
} as const;

export type TKey = Readonly<string | number | symbol | boolean | bigint>;
