/* eslint-env node */
module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
  },
  ignorePatterns: ["dist", "node_modules", "__tests__"],
  overrides: [
    {
      files: ["**/__tests__/**/*"],
      rules: {
        // https://github.com/jest-community/eslint-plugin-jest
        "jest/no-focused-tests": 2,
        "jest/valid-expect": 2,
        "jest/valid-expect-in-promise": 2,
      },
    },
  ],
};
