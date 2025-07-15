import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // ✅ Ignore Prisma generated files completely
  {
    ignores: ["lib/generated/**/*"],
  },

  // ✅ Or (alternative) allow them, but disable specific rules
  // {
  //   files: ["lib/generated/**/*"],
  //   rules: {
  //     "@typescript-eslint/no-unused-vars": "off",
  //     "@typescript-eslint/no-require-imports": "off",
  //   },
  // },

  // ✅ Your main ESLint rules from Next.js
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];