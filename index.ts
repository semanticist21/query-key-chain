type BaseItem<T extends string> = T | string;

interface QueryArrayBase<TBase extends string, TParams = unknown>
  extends Array<BaseItem<TBase> | TParams> {
  all: () => Readonly<QueryAllArray<TBase>>;

  lists: () => Readonly<QueryListArray<TBase>>;
  list: (key: string) => Readonly<QueryListArray<TBase>>;

  details: () => Readonly<QueryDetailArray<TBase>>;
  detail: (key: string) => Readonly<QueryDetailArray<TBase>>;

  action: (action: string) => Readonly<QueryActionArray<TBase>>;

  params: (params: TParams) => Readonly<QueryParamsArray<TBase, TParams>>;
}

type QueryAllArray<T extends string, TParams = unknown> = QueryArrayBase<
  BaseItem<T>,
  TParams
> &
  Array<unknown>;

type QueryListArray<T extends string> = Pick<
  QueryAllArray<T>,
  "details" | "detail" | "params"
> &
  Array<unknown>;

type QueryDetailArray<T extends string> = Pick<QueryAllArray<T>, "params"> &
  Array<unknown>;

type QueryActionArray<T extends string> = Pick<QueryAllArray<T>, "params"> &
  Array<unknown>;

type QueryParamsArray<TBase extends string, TParams> = QueryAllArray<
  TBase,
  TParams
> &
  Array<unknown>;

const handler = {
  get<TBase extends string, TParams = unknown>(
    target: Readonly<Array<unknown>>,
    prop: unknown,
    receiver: Readonly<QueryArrayBase<TBase, TParams>>
  ) {
    if (prop === "all") {
      return function () {
        return new Proxy([...receiver, "all"], handler) as Readonly<
          QueryAllArray<TBase>
        >;
      };
    }

    if (prop === "lists") {
      return function () {
        return new Proxy([...receiver.all(), "list"], handler);
      };
    }

    if (prop === "list") {
      return function (key: string) {
        return new Proxy([...receiver.lists(), key], handler);
      };
    }

    if (prop === "details") {
      return function () {
        // direct access
        if ("lists" in receiver) {
          return new Proxy([...receiver.all(), "detail"], handler);
        }

        // chaining access
        return new Proxy([...receiver, "detail"], handler);
      };
    }

    if (prop === "detail") {
      return function (key: string) {
        return new Proxy([...receiver.details(), key], handler);
      };
    }

    if (prop === "action") {
      // direct access
      if ("lists" in receiver) {
        return function (action: string) {
          return new Proxy([...receiver.all(), action], handler);
        };
      }

      // chaining access
      return function (action: string) {
        return new Proxy([...receiver, action], handler);
      };
    }

    if (prop === "params") {
      // direct access
      if ("lists" in receiver) {
        return function (params: unknown) {
          return new Proxy([...receiver, params], handler);
        };
      }

      // chaining access
      return function (params: unknown) {
        return new Proxy([...receiver, params], handler);
      };
    }

    return Reflect.get(target, prop as PropertyKey, receiver);
  },
};

export const createQueryFactory = <TBase extends string, TParams = unknown>(
  baseQuery: TBase
) =>
  new Proxy(
    [baseQuery] as unknown as QueryArrayBase<TBase, TParams>,
    handler
  ) as QueryArrayBase<TBase, TParams>;
