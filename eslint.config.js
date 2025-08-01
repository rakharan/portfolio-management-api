// eslint.config.js
const parserTypeScript = require("@typescript-eslint/parser");
const pluginTypeScript = require("@typescript-eslint/eslint-plugin");

module.exports = [
  {
    ignores: ["node_modules", "dist", "**/*.test.ts", "build"], // ✅ move here
  },
  {
    files: ["**/*.{ts,js}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: parserTypeScript,
    },
    plugins: {
      "@typescript-eslint": pluginTypeScript,
    },
    rules: {
      // your rules here if needed
    },
  },
  {
    files: [".eslintrc.{js,cjs}"],
    languageOptions: {
      sourceType: "script",
    },
    env: {
      node: true,
    },
  },
];
