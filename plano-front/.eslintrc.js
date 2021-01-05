module.exports = {
  root: true,
  env: { node: true },
  extends: ["plugin:vue/essential", "eslint:recommended", "prettier"],
  parserOptions: { parser: "babel-eslint", sourceType: "module", ecmaVersion: 2018 },
  parser: "vue-eslint-parser",
  rules: {
    "space-before-function-paren": ["error", "never"],
    indent: ["error", 2],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "no-prototype-builtins": "warn",
    "arrow-parens": ["error", "always"],
    "vue/require-prop-type-constructor": "warn",
    "max-len": [
      "error",
      { code: 100, ignoreStrings: true, ignoreTemplateLiterals: true, ignoreComments: true },
    ],
    "comma-dangle": [
      2,
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "never",
      },
    ],
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  },
};
