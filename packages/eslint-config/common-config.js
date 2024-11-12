/** @type {import('eslint').Linter.LegacyConfig} */
module.exports = {
  extends: [
    "expo",
    "prettier",
    "plugin:import/recommended",
    "plugin:jest/recommended",
  ],
  plugins: ["prettier", "import", "jest"],
  rules: {
    "prettier/prettier": "error",
    "react-hooks/exhaustive-deps": "error",
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
    "sort-imports": [
      "error",
      { ignoreCase: true, ignoreDeclarationSort: true },
    ],
    "no-unused-vars": "error",
  },
  env: {
    node: true,
    jest: true,
  },
  settings: {
    "import/resolver": {
      "babel-module": {
        alias: {
          "~": "./src",
        },
      },
    },
  },
};
