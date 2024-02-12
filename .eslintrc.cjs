module.exports = {
  extends: ["eslint:recommended"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      extends: [
        "standard-with-typescript",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "prettier"
      ],
      plugins: ["prettier", "react-refresh"],
      parserOptions: {
        project: "./tsconfig.json"
      },
      rules: {
        "prettier/prettier": ["error"],
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/strict-boolean-expressions": "off",
        "react/function-component-definition": [
          2,
          { namedComponents: "function-declaration" }
        ],
        "react-refresh/only-export-components": [
          "warn",
          { allowConstantExport: true }
        ]
      }
    },
    {
      files: ["*.js", "*.cjs"],
      extends: ["standard", "prettier"],
      plugins: ["prettier", "react-refresh"],
      rules: {
        "prettier/prettier": ["error"],

        "react-refresh/only-export-components": [
          "warn",
          { allowConstantExport: true }
        ]
      }
    }
  ]
};
