import { test, expect } from "@jest/globals";
import { createQueryKey, createQueryKeyFactory, keyChain } from ".";

// direct
test("query key test - all", () => {
  const base = createQueryKey("test");
  const match = ["test", "all"];

  const result = base.all();

  expect(result).toEqual(match);
});

test("query key test - direct:lists", () => {
  const base = createQueryKey("test");
  const match = ["test", "all", "list"];

  const result = base.lists();

  expect(result).toEqual(match);
});

test("query key test - direct:list", () => {
  const base = createQueryKey("test");
  const match = ["test", "all", "list", "list-test"];

  const result = base.list("list-test");

  expect(result).toEqual(match);
});

test("query key test - direct:details", () => {
  const base = createQueryKey("test");
  const match = ["test", "all", "detail"];

  const result = base.details();

  expect(result).toEqual(match);
});

test("query key test - direct:detail", () => {
  const base = createQueryKey("test");
  const match = ["test", "all", "detail", "detail-test"];

  const result = base.detail("detail-test");

  expect(result).toEqual(match);
});

// indirect
test("query key test - chain:list > details", () => {
  const base = createQueryKey("test");
  const match = ["test", "all", "list", "list-test", "detail"];

  const result = base.list("list-test").details();

  expect(result).toEqual(match);
});

test("query key test - chain:list > actions", () => {
  const base = createQueryKey("test");
  const match = ["test", "all", "list", "list-test", "action"];

  const result = base.list("list-test").actions();

  expect(result).toEqual(match);
});

test("query key test - chain:list > actions > params", () => {
  const base = createQueryKey("test");
  const match = ["test", "all", "list", "list-test", "action", { test: 1 }];

  const result = base.list("list-test").actions().params({ test: 1 });

  expect(result).toEqual(match);
});
test("query key test - chain:list > params", () => {
  const base = createQueryKey("test");
  const match = ["test", "all", "list", "list-test", { test: 1 }];

  const result = base.list("list-test").params({ test: 1 });

  expect(result).toEqual(match);
});

test("query key test - chain:detail > params", () => {
  const base = createQueryKey("test");
  const match = ["test", "all", "action", "action-test", { test: 1 }];

  const result = base.action("action-test").params({ test: 1 });

  expect(result).toEqual(match);
});
test("query key test - chain:actions > params", () => {
  const base = createQueryKey("test");
  const match = ["test", "all", "action", { test: 1 }];

  const result = base.actions().params({ test: 1 });

  expect(result).toEqual(match);
});

test("query key test - chain:detail > action > params", () => {
  const base = createQueryKey("test");
  const match = [
    "test",
    "all",
    "detail",
    "detail-test",
    "action",
    "action-test",
    { test: 1 },
  ];

  const result = base
    .detail("detail-test")
    .action("action-test")
    .params({ test: 1 });

  expect(result).toEqual(match);
});

test("query key test - chain:action > params", () => {
  const base = createQueryKey("test");
  const match = ["test", "all", "action", "action-test", { test: 1 }];

  const action = base.action("action-test");
  const result = action.params({ test: 1 });
  const result2 = action.params({ test: 1, gg: 123 });

  expect(result).toEqual(match);
  expect(result2).toEqual([...match.slice(0, -1), { test: 1, gg: 123 }]);
});

test("query key test - chain:list > detail", () => {
  const base = createQueryKey("test");
  const match = ["test", "all", "list", "list-test", "detail", "detail-test"];

  const result = base.list("list-test").detail("detail-test");

  expect(result).toEqual(match);
});

test("query key test - chain:list > actions", () => {
  const base = createQueryKey("test");
  const match = ["test", "all", "list", "list-test", "action"];

  const result = base.list("list-test").actions();

  expect(result).toEqual(match);
});

test("query key test - chain:list > action", () => {
  const base = createQueryKey("test");
  const match = ["test", "all", "list", "list-test", "action", "action-test"];

  const result = base.list("list-test").action("action-test");

  expect(result).toEqual(match);
});

test("query key test - chain:list > detail > action", () => {
  const base = createQueryKey("test");
  const match = [
    "test",
    "all",
    "list",
    "list-test",
    "detail",
    "detail-test",
    "action",
    "action-test",
  ];

  const result = base
    .list("list-test")
    .detail("detail-test")
    .action("action-test");

  expect(result).toEqual(match);
});

test("query key test - chain:list > detail > action > params", () => {
  const base = createQueryKey("test");
  const match = [
    "test",
    "all",
    "list",
    "list-test",
    "detail",
    "detail-test",
    "action",
    "action-test",
    { test: 1 },
  ];

  const result = base
    .list("list-test")
    .detail("detail-test")
    .action("action-test")
    .params({ test: 1 });

  expect(result).toEqual(match);
});

test("query key test - chain:list > action > params", () => {
  const base = createQueryKey("test");
  const match = [
    "test",
    "all",
    "list",
    "list-test",
    "action",
    "action-test",
    { test: 2, test2: 3 },
  ];

  const result = base
    .list("list-test")
    .action("action-test")
    .params({ test: 2, test2: 3 });

  expect(result).toEqual(match);
});

test("query key type test - chain:list > params", () => {
  const match = ["-3", "all", "list", -2, { test: 3 }];
  const result = keyChain("-3").list(-2).params({ test: 3 });

  expect(result).toEqual(match);
});

// type
test("query key type test - type:lists", () => {
  const match = ["true", "all", "list"];
  const result = keyChain("true").lists();

  expect(result).toEqual(match);
});

test("query key type test - type:list", () => {
  const match = ["1", "all", "list", true, "action", "0"];
  const result = keyChain("1").list(true).action("0");

  expect(result).toEqual(match);
});

test("query key type test - type:action", () => {
  const match = ["1", "all", "list", 3, "action", true];
  const result = keyChain("1").list(3).action(true);

  expect(result).toEqual(match);
});

test("query key type test - type:list>detail>action>params", () => {
  const match = [
    "-3",
    "all",
    "list",
    -2,
    "detail",
    -1,
    "action",
    3,
    { test: 3 },
  ];
  const result = keyChain("-3")
    .list(-2)
    .detail(-1)
    .action(3)
    .params({ test: 3 });

  expect(result).toEqual(match);
});

// has test
test("query key type test - type:list>detail>action>params", () => {
  const has = "list" in keyChain("1");

  expect(has).toBe(true);
});

// whether key retained test
test("query key type test - type:list>detail>action>params", () => {
  const base = createQueryKey("test");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  base
    .list("list-test")
    .detail("detail-test")
    .action("action-test")
    .params({ test: 3 });

  const match = ["test", "all", "list", "list-test", "detail", "detail-test"];
  const second = base.list("list-test").detail("detail-test");

  expect(second).toEqual(match);
});

// query key factory
test("query key factory test", () => {
  const keyStore = createQueryKeyFactory("1", "2", "3", "4");

  keyStore("1");
  keyStore("2");
  keyStore("3");
  keyStore("4");

  // @ts-expect-error for test
  keyStore("5");
});

// performance
test("query key test - performance test", () => {
  const start = performance.now();
  for (let i = 0; i < 3000; i++) {
    createQueryKey("test")
      .list("list-test")
      .action("action-test")
      .params({ test: 2, test2: 3 });

    keyChain("test")
      .list("list-test")
      .action("action-test")
      .params({ test: 2, test2: 3 });
  }

  const end = performance.now();

  const duration = end - start;

  const threshold = 100; // 밀리초
  expect(duration).toBeLessThan(threshold);
});
