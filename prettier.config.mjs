/** @type {import("prettier").Config} */
const config = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: "es5",
  bracketSpacing: false,
  arrowParens: "always",
  endOfLine: "lf",
  importOrder: [
    "^@public/(.*)$",
    "^@ui/(.*)$",
    "^@components/(.*)$",
    "^@hooks/(.*)$",
    "^@utils/(.*)$",
    "^@/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
  ],
};

export default config;
