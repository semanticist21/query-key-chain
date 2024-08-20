// TODO prevent key duplication by input
export const KEY_ATTACH = {
  all: "#all",
  list: "#list",
  detail: "#detail",
  action: "#action",
  params: "#params",
} as const;

// key list
export const actionsObjectKeys = ["params"];
export const detailObjectKeys = ["actions", "action", ...actionsObjectKeys];
export const listObjectKeys = ["details", "detail", ...detailObjectKeys];
export const allObjectKeys = ["all", "lists", "list", ...listObjectKeys];

export type TKey = Readonly<string | number | symbol | boolean | bigint>;
