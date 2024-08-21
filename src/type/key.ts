export const KEY_ATTACH = {
  all: { level: "#all" },
  list: { level: "#list" },
  detail: { level: "#detail" },
  action: { level: "#action" },
  params: { level: "#params" },
} as const;

// key list
export const actionsObjectKeys = ["params"];
export const detailObjectKeys = ["actions", "action", ...actionsObjectKeys];
export const listObjectKeys = ["details", "detail", ...detailObjectKeys];
export const allObjectKeys = ["all", "lists", "list", ...listObjectKeys];

export type TKey = Readonly<string | number | symbol | boolean | bigint>;
