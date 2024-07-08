import { createQueryKeyFactory } from "@kkoms/query-key-chain";

// now chain behaves the same as `createQueryKey` with the base key types 'dashboard', 'user', and 'account'
// useful when you have to manage keys globally and enforce type safety
export const chain = createQueryKeyFactory("dashboard", "user", "account");

// only 'dashboard', 'user', and 'account' are allowed
chain("dashboard").lists();
chain("account").details();
chain("user").list(1).detail(1);

// @ts-expect-error it have type error
chain("something").list();
